const axios = require('axios');

exports.sendVerificationCode = async (phoneNumber, code) => {
    try {
        // Clean phone number (remove spaces, dashes, etc.)
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        
        // Add country code if not present (assuming Ethiopia +251)
        const formattedPhone = cleanPhone.startsWith('251') ? cleanPhone : `251${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;
        
        const message = `Your Tera Smart Line password reset code is: ${code}. This code expires in 10 minutes.`;
        
        console.log('🔄 Attempting to send SMS to:', formattedPhone);
        console.log('📱 Message:', message);
        
        // Try TextBelt first (works internationally)
        try {
            const response = await axios.post('https://textbelt.com/text', {
                phone: `+${formattedPhone}`,
                message: message,
                key: process.env.TEXTBELT_API_KEY || 'textbelt'
            }, {
                timeout: 10000 // 10 second timeout
            });
            
            console.log('📡 TextBelt response:', response.data);
            
            if (response.data.success) {
                console.log('✅ SMS sent successfully via TextBelt');
                return { success: true, messageId: response.data.textId, provider: 'TextBelt' };
            } else {
                console.log('❌ TextBelt failed:', response.data.error);
                throw new Error(response.data.error || 'TextBelt API failed');
            }
        } catch (textbeltError) {
            console.log('⚠️ TextBelt failed:', textbeltError.message);
            
            // In development mode, always return success with code in console
            if (process.env.NODE_ENV === 'development') {
                console.log('🔧 DEVELOPMENT MODE: SMS code is', code);
                console.log('💡 Use this code to continue the password reset process');
                return { 
                    success: true, 
                    messageId: 'dev-' + Date.now(), 
                    provider: 'Development Console',
                    code: code // Only in development
                };
            }
            
            throw textbeltError;
        }
        
    } catch (error) {
        console.error('💥 SMS sending completely failed:', error.message);
        
        // In development, still return the code
        if (process.env.NODE_ENV === 'development') {
            console.log('🔧 DEVELOPMENT FALLBACK: Your reset code is', code);
            return { 
                success: true, 
                messageId: 'dev-fallback-' + Date.now(), 
                provider: 'Development Fallback',
                code: code
            };
        }
        
        throw error;
    }
};