import CompanionForm from "@/components/CompanionForm";
import { Button } from "@/components/ui/button";
import { newCompanionPermissions } from "@/lib/actions/companion.actions";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const NewCompanion = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const canCreate = await newCompanionPermissions();
  return (
    <main className="lg:w-1/3 md:w-1/3 items-center justify-center">
      {canCreate ? (
        <article className="w-full gap-4 flex flex-col">
          <h1>Companion Builder</h1>
          <CompanionForm />
        </article>
      ) : (
        <article className="companion-limit">
          <Image
            src="/images/limit.svg"
            alt="Companion limit reached"
            width={360}
            height={230}
          />
          <div className="cta-badge"> Upgrade Your Plan</div>
          <h1>You have reached your limit !!</h1>
          <p>
            You've reached your companion limit. Upgrade to a pro plan to create
            more.
          </p>
          <Link
            href="/subscription"
            className="btn-primary w-full justify-center"
          >
            <Button>Upgrade My Plan</Button>
          </Link>
        </article>
      )}
    </main>
  );
};

export default NewCompanion;
