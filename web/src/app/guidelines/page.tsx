import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guidelines - Blaze",
  description: "Check out our community guidelines to ensure a safe and fun streaming/chatting experience.",
};

export default function Guidelines() {
  return (
    <>
      <div className="mx-auto text-center max-w-[40rem] mb-8">
        <h1 className="font-bold text-4xl mb-4 text-center">Blaze Guidelines</h1>
        <p>
          We want our streaming platform to be a fun, safe, and inclusive space for everyone. To keep it that way, please follow these simple guidelines while using Blaze:
        </p>
      </div>

      <h2 className="font-bold mb-2">What You Should NOT Show on Stream</h2>
      <ul className="list-decimal ml-6 mb-8">
        <li>
          <b>Hate Speech & Harassment</b> – no racism, sexism, homophobia, or any form of discrimination or bullying.
        </li>
        <li>
          <b>Violence & Gore</b> – no real-life violence, extreme injuries, or graphic content.
        </li>
        <li>
          <b>Nudity & Sexual Content</b> – no nudity, pornography, or sexually explicit material.
        </li>
        <li>
          <b>Illegal Activities</b> – no drugs, crime, or any activity that breaks the law.
        </li>
        <li>
          <b>Harmful & Dangerous Challenges</b> – no self-harm, risky stunts, or anything that can put you or others in danger.
        </li>
        <li>
          <b>Unauthorized Content</b> –  no streaming copyrighted movies, music, or other protected content without permission.
        </li>
      </ul>

      <p>
        By streaming on our platform, you agree to follow these guidelines. If you violate them, we may take action, including warnings, suspensions, or bans. Let&apos;s make this a great space for everyone!
      </p>
    </>
  );
}
