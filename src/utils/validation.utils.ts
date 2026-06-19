import {z} from 'zod';

const phoneRegex = /^(\+91)?[6-9]\d{9}$/;

// ─── Primitives ───────────────────────────────────────────────────────────────

export const zPhone = z
  .string()
  .regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number');

export const zEmail = z
  .string()
  .email('Enter a valid email address')
  .optional()
  .or(z.literal(''));

export const zPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[0-9]/, 'Must contain a number');

// ─── Auth schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export const changePasswordSchema = z
  .object({
    newPassword: zPassword,
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const signupSchema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: zPassword,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

// ─── Devotee schemas ──────────────────────────────────────────────────────────

export const devoteeBasicInfoSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  mobileNumber: zPhone,
  email: zEmail,
  gender: z.enum(['male', 'female', 'other']).nullable(),
  dateOfBirth: z.date().nullable(),
});

export const devoteeDevotionalInfoSchema = z.object({
  primaryCategory: z.enum(['IGF', 'IYF', 'ICF_MEETING', 'ICF_PROGRAM']),
  categories: z.array(z.enum(['IGF', 'IYF', 'ICF_MEETING', 'ICF_PROGRAM'])).min(1),
  teamId: z.string().min(1, 'Team is required'),
  mentorId: z.string().nullable(),
  joiningDate: z.date(),
});

export const devoteeAdditionalInfoSchema = z.object({
  city: z.string().nullable(),
  occupation: z.string().nullable(),
  maritalStatus: z.enum(['single', 'married', 'widowed', 'divorced']).nullable(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type DevoteeBasicInfoData = z.infer<typeof devoteeBasicInfoSchema>;
export type DevoteeDevotionalInfoData = z.infer<typeof devoteeDevotionalInfoSchema>;
export type DevoteeAdditionalInfoData = z.infer<typeof devoteeAdditionalInfoSchema>;
