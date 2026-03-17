import { FontStyle, LinkKind, ProfileLayout, TextAlign, ThemeKey } from "@prisma/client";
import { z } from "zod";

const usernameRegex = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/;
const emailSchema = z.email();

const optionalEmailField = z
  .string()
  .trim()
  .refine((value) => value.length === 0 || emailSchema.safeParse(value).success, {
    message: "Enter a valid email address.",
  });

const optionalShortTextField = (max: number) => z.string().trim().max(max);

export const signUpSchema = z
  .object({
    email: z.email().transform((value) => value.toLowerCase()),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required."),
});

export const profileLinkSchema = z.object({
  id: z.string().optional(),
  kind: z.nativeEnum(LinkKind),
  label: z.string().trim().max(60).optional().or(z.literal("")),
  url: z.url("Enter a valid URL."),
  orderIndex: z.number().int().nonnegative(),
});

export const editableProfileLinkSchema = profileLinkSchema.extend({
  url: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || z.url().safeParse(value).success, {
      message: "Enter a valid URL.",
    }),
});

const profileBaseSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(usernameRegex, "Use 3-30 lowercase letters, numbers, or hyphens."),
  displayName: z.string().trim().min(2).max(60),
  bio: z.string().trim().max(240),
  themeKey: z.nativeEnum(ThemeKey),
  layout: z.nativeEnum(ProfileLayout),
  fontStyle: z.nativeEnum(FontStyle),
  textAlign: z.nativeEnum(TextAlign),
  photoObjectKey: z.string().trim().optional().nullable(),
  backgroundObjectKey: z.string().trim().optional().nullable(),
  contactCardEnabled: z.boolean(),
  contactEmail: optionalEmailField,
  contactPhone: optionalShortTextField(40),
  contactCompany: optionalShortTextField(80),
  contactTitle: optionalShortTextField(80),
});

function validateContactMethod(
  value: Pick<
    z.infer<typeof profileBaseSchema>,
    "contactCardEnabled" | "contactEmail" | "contactPhone"
  >,
  context: z.RefinementCtx,
) {
  if (!value.contactCardEnabled) {
    return;
  }

  if (value.contactEmail.length === 0 && value.contactPhone.length === 0) {
    context.addIssue({
      code: "custom",
      message: "Add at least an email or phone number to enable Add to Contacts.",
      path: ["contactEmail"],
    });
  }
}

export const profileSchema = profileBaseSchema
  .extend({
    links: z.array(profileLinkSchema).max(12),
  })
  .superRefine(validateContactMethod);

export const editableProfileSchema = profileBaseSchema
  .extend({
    links: z.array(editableProfileLinkSchema).max(12),
  })
  .superRefine(validateContactMethod);

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;

export function flattenZodError(error: z.ZodError) {
  const fieldErrors = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0] ?? "Invalid value."]),
  );
}
