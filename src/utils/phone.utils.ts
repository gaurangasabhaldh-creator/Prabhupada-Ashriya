import {Linking, Platform} from 'react-native';

export const formatToE164 = (phone: string, countryCode = '91'): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith(countryCode)) return `+${digits}`;
  return `+${countryCode}${digits}`;
};

export const formatForDisplay = (phone: string): string => {
  const digits = phone.replace(/\D/g, '').slice(-10);
  return digits.replace(/(\d{5})(\d{5})/, '$1 $2');
};

export const openDialer = async (phone: string): Promise<void> => {
  const url = `tel:${phone}`;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  }
};

export const openWhatsApp = async (
  phone: string,
  message = '',
): Promise<void> => {
  const e164 = formatToE164(phone).replace('+', '');
  const encodedMessage = encodeURIComponent(message);
  const url =
    Platform.OS === 'android'
      ? `whatsapp://send?phone=${e164}&text=${encodedMessage}`
      : `https://wa.me/${e164}?text=${encodedMessage}`;

  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  }
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
