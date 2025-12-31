/**
 * Queue Service - Handles the business logic for virtual ticketing.
 * Requirements addressed: FCFS logic, wait time calculation, and duplicate prevention.
 */
const { QueueTicket, Service, sequelize } = require('../models');

class QueueService {
  /**
   * Adds a user to a specific service queue.
   * @param {number} userId - Extracted from the Auth middleware.
   * @param {number} serviceId - Selected by the user on the frontend.
   * @param {number} officeId - Selected office branch.
   */
  async joinQueue(userId, serviceId, officeId) {
    // 1. Check for duplicate entries (Requirement 3.2.2.5)
    const existingTicket = await QueueTicket.findOne({
      where: { userId, serviceId, status: 'waiting' }
    });
    if (existingTicket) {
      throw new Error('You are already in this queue.');
    }

    // 2. Get the service details to find the 'average duration' (Requirement 3.2.2.3)
    const service = await Service.findByPk(serviceId);
    if (!service) throw new Error('Service not found.');

    // 3. Calculate current queue position
    // Count how many people are 'waiting' for this specific service
    const peopleAhead = await QueueTicket.count({
      where: { serviceId, officeId, status: 'waiting' }
    });

    // 4. Generate Queue Number (Simple increment logic)
    const queueNumber = peopleAhead + 1;

    // 5. Calculate Estimated Wait Time (Requirement 3.2.2.3)
    // Formula: People Ahead * Average Service Duration
    const estimatedWaitTime = peopleAhead * service.avg_duration;

    // 6. Create the ticket record in the database
    const ticket = await QueueTicket.create({
      userId,
      serviceId,
      officeId,
      queue_number: queueNumber,
      estimated_wait_time: estimatedWaitTime,
      status: 'waiting'
    });

    return ticket;
  }

  /**
   * Retrieves the current position for a user's ticket.
   * Useful for the 10-second real-time refresh (Requirement 3.4.1).
   */
  async getLiveStatus(ticketId) {
    const ticket = await QueueTicket.findByPk(ticketId);
    if (!ticket || ticket.status !== 'waiting') return { status: 'served' };

    // Count how many people have a lower ID/CreatedDate and are still waiting
    const position = await QueueTicket.count({
      where: {
        serviceId: ticket.serviceId,
        status: 'waiting',
        id: { [sequelize.Op.lt]: ticket.id } // Only count those who joined before this ticket
      }
    });

    return {
      position: position + 1, // 1 means you are next
      estimatedWaitTime: position * 15 // Assuming 15 mins avg if not defined
    };
  }
}

module.exports = new QueueService();