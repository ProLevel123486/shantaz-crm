// WhatsApp Business API Integration
// This is a basic integration setup for WhatsApp Business API

interface WhatsAppMessage {
  to: string
  body: string
  templateName?: string
  templateParams?: string[]
}

interface WhatsAppConfig {
  phoneNumberId: string
  accessToken: string
  apiVersion: string
}

export class WhatsAppService {
  private config: WhatsAppConfig

  constructor() {
    this.config = {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
      apiVersion: process.env.WHATSAPP_API_VERSION || "v17.0",
    }
  }

  /**
   * Send a text message via WhatsApp
   */
  async sendTextMessage(to: string, message: string): Promise<boolean> {
    if (!this.config.phoneNumberId || !this.config.accessToken) {
      console.warn("WhatsApp credentials not configured")
      return false
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/${this.config.apiVersion}/${this.config.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: to.replace(/[^0-9]/g, ""), // Remove non-numeric characters
            type: "text",
            text: {
              body: message,
            },
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        console.error("WhatsApp API error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error sending WhatsApp message:", error)
      return false
    }
  }

  /**
   * Send a template message via WhatsApp
   */
  async sendTemplateMessage(
    to: string,
    templateName: string,
    params: string[] = []
  ): Promise<boolean> {
    if (!this.config.phoneNumberId || !this.config.accessToken) {
      console.warn("WhatsApp credentials not configured")
      return false
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/${this.config.apiVersion}/${this.config.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: to.replace(/[^0-9]/g, ""),
            type: "template",
            template: {
              name: templateName,
              language: {
                code: "en",
              },
              components: params.length > 0 ? [
                {
                  type: "body",
                  parameters: params.map((param) => ({
                    type: "text",
                    text: param,
                  })),
                },
              ] : [],
            },
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        console.error("WhatsApp API error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error sending WhatsApp template:", error)
      return false
    }
  }

  /**
   * Send notification for service request
   */
  async sendServiceRequestNotification(
    phoneNumber: string,
    ticketNumber: string,
    status: string
  ): Promise<boolean> {
    const message = `Your service request ${ticketNumber} has been updated. Status: ${status}`
    return this.sendTextMessage(phoneNumber, message)
  }

  /**
   * Send installation schedule notification
   */
  async sendInstallationNotification(
    phoneNumber: string,
    workOrderNumber: string,
    scheduledDate: string
  ): Promise<boolean> {
    const message = `Your installation ${workOrderNumber} has been scheduled for ${scheduledDate}`
    return this.sendTextMessage(phoneNumber, message)
  }

  /**
   * Send contract reminder
   */
  async sendContractReminder(
    phoneNumber: string,
    contractNumber: string,
    daysRemaining: number
  ): Promise<boolean> {
    const message = `Reminder: Your contract ${contractNumber} will expire in ${daysRemaining} days`
    return this.sendTextMessage(phoneNumber, message)
  }

  /**
   * Send quote notification
   */
  async sendQuoteNotification(
    phoneNumber: string,
    quoteNumber: string,
    amount: number
  ): Promise<boolean> {
    const message = `Your quote ${quoteNumber} for ₹${amount.toLocaleString()} has been generated. Please review and approve.`
    return this.sendTextMessage(phoneNumber, message)
  }
}

// Singleton instance
export const whatsappService = new WhatsAppService()
