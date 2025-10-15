// Declaração global para fbq, para que TypeScript não reclame
declare global {
  interface Window {
    fbq: (
      command: 'init' | 'track' | 'trackCustom',
      eventName: string,
      parameters?: Record<string, any>
    ) => void;
  }
}

export const trackWhatsAppLead = (userName: string, whatsappNumber: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'WhatsApp Lead Submission',
      value: 0, // Você pode definir um valor se houver um valor monetário associado ao lead
      currency: 'BRL',
      user_name: userName,
      whatsapp_number: whatsappNumber,
    });
    console.log('Facebook Pixel: Lead event tracked for WhatsApp submission.', { userName, whatsappNumber });
  } else {
    console.warn('Facebook Pixel not initialized or fbq function not available.');
  }
};