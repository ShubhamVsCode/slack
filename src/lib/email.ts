"use server";

import { InviteMemberEmailTemplate } from "@/components/emails/invite-member";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInviteMemberEmail = async (
  email: string,
  workspaceName: string,
  inviterName: string,
  inviteLink: string,
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Support Slack Shubh <support@slack.shubh.one>",
      to: [email],
      subject: "Welcome to the team!",
      react: InviteMemberEmailTemplate({
        workspaceName,
        inviterName,
        inviteLink,
      }),
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
