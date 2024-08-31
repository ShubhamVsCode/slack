import * as React from "react";

interface EmailTemplateProps {
  workspaceName: string;
  inviterName: string;
  inviteLink: string;
}

export const InviteMemberEmailTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ workspaceName, inviterName, inviteLink }) => (
  <div
    style={{
      fontFamily: "Inter, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f4f4f4",
    }}
  >
    <h1
      style={{
        color: "#333",
        borderBottom: "1px solid #ccc",
        paddingBottom: "10px",
      }}
    >
      Welcome to {workspaceName}!
    </h1>
    <p>
      You&apos;ve been invited to join the {workspaceName} workspace by{" "}
      {inviterName}.
    </p>
    <p>Click the button below to accept the invitation and get started:</p>
    <a
      href={inviteLink}
      style={{
        display: "inline-block",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#ffffff",
        textDecoration: "none",
        borderRadius: "5px",
        marginTop: "15px",
      }}
    >
      Join Workspace
    </a>
    <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
      If you have any questions, please don&apos;t hesitate to reach out to our
      support team.
    </p>
  </div>
);
