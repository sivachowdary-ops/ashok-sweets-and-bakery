import { CartItem } from '../store/cartStore';

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

export function generateWhatsAppOrderLink(items: CartItem[], subtotal: number, customer: CustomerDetails): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  
  if (!phoneNumber) {
    console.error("WhatsApp number is not configured in environment variables.");
  }

  const header = "🎉 *New Order from Website!* 🎉\n\n";
  
  const customerSection = `*Customer Details:*\n👤 Name: ${customer.name}\n📞 Contact: ${customer.phone}\n📍 Address: ${customer.address}\n\n`;

  const orderSection = "*Order Details:*\n" + items.map((item, index) => {
    let weightLabel = '';
    if (item.selectedWeight === 'half_kg') weightLabel = ' (½kg)';
    if (item.selectedWeight === 'one_kg') weightLabel = ' (1kg)';
    
    return `${index + 1}. ${item.product.name}${weightLabel} x${item.quantity} — ₹${item.priceAtSelection * item.quantity}`;
  }).join('\n');
  
  const footer = `\n\n💰 *Estimated Total: ₹${subtotal}*\n\n(Please wait for our confirmation regarding delivery time & charges.)`;
  
  const message = header + customerSection + orderSection + footer;
  
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
