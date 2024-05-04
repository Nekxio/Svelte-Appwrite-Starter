import { object, string, z, ZodIssueCode } from 'zod';
import { i18n } from '$lib/i18n';

export const loginSchema = object({
	email: string()
		.email(i18n.validation_error({ field: 'email', code: 'invalid' }))
		.min(1, i18n.validation_error({ field: 'email', code: 'required' })),
	password: string().min(1, i18n.validation_error({ field: 'password', code: 'required' }))
});

export const registerSchema = loginSchema
	.extend({
		name: string().min(1, i18n.validation_error({ field: 'name', code: 'required' })),
		confirmPassword: string().min(1, i18n.validation_error({ field: 'confirmPassword', code: 'required' }))
	})
	.superRefine((val, ctx) => {
		if (val.password !== val.confirmPassword) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				message: i18n.validation_error({ field: 'confirmPassword', code: 'not_matching' }),
				path: ['confirmPassword']
			});
		}

		const password = val.password;

		if (password && password.length < 8) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				message: i18n.validation_error({ field: 'password', code: 'too_short' }),
				path: ['password']
			});
		}

		if (password && password.length > 0) {
			const hasUppercase = /[A-Z]/.test(password);
			const hasLowercase = /[a-z]/.test(password);
			const hasDigit = /[0-9]/.test(password);
			const hasSpecial = /[^A-Za-z0-9]/.test(password);

			if (!hasUppercase) {
				ctx.addIssue({
					code: ZodIssueCode.custom,
					message: i18n.validation_error({ field: 'password', code: 'no_uppercase' }),
					path: ['password']
				});
			}

			if (!hasLowercase) {
				ctx.addIssue({
					code: ZodIssueCode.custom,
					message: i18n.validation_error({ field: 'password', code: 'no_lowercase' }),
					path: ['password']
				});
			}

			if (!hasDigit) {
				ctx.addIssue({
					code: ZodIssueCode.custom,
					message: i18n.validation_error({ field: 'password', code: 'no_digit' }),
					path: ['password']
				});
			}

			if (!hasSpecial) {
				ctx.addIssue({
					code: ZodIssueCode.custom,
					message: i18n.validation_error({ field: 'password', code: 'no_special' }),
					path: ['password']
				});
			}
		}
	});

export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
