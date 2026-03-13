import CompanionList from "@/components/CompanionList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getUserCompanions,
  getUserSessions,
} from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Profile = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);

  return (
    <main className="w-full lg:w-3/4 mx-auto flex flex-col gap-8 mt-8">
      <section className="flex justify-between w-full max-sm:flex-col sm:items-center gap-8">
        <div className="flex gap-4 items-center">
          <Image
            src={user.imageUrl}
            alt={user.firstName!}
            width={110}
            height={110}
            className="rounded-full object-cover"
          />

          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/check.svg"
                alt="checkmark"
                width={20}
                height={20}
              />
              <p className="text-2xl font-bold">{sessionHistory.length}</p>
            </div>

            <div>Lessons Completed</div>
          </div>

          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image src="/icons/cap.svg" alt="cap" width={20} height={20} />
              <p className="text-2xl font-bold">{companions.length}</p>
            </div>

            <div>AI Companions Created</div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <Accordion type="multiple" className="w-full flex flex-col gap-4">
          <AccordionItem value="recent" className="border px-4 rounded-xl">
            <AccordionTrigger className="text-2xl font-bold hover:no-underline">
              Recent Sessions
            </AccordionTrigger>
            <AccordionContent>
              <CompanionList
                title="Recent Sessions"
                companions={sessionHistory}
                classNames="w-full"
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="companions" className="border px-4 rounded-xl">
            <AccordionTrigger className="text-2xl font-bold hover:no-underline">
              My Companions {`(${companions.length})`}
            </AccordionTrigger>
            <AccordionContent>
              <CompanionList
                title="My Companions"
                companions={companions}
                classNames="w-full"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
};

export default Profile;
