import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { SavedEvents } from "@/components/organiser/saved-events";
import { CreateEventForm } from "./CreateEventForm";

export const metadata: Metadata = {
  title: "Create your event",
  description: "Set up Three Hellos for your event in a minute. Free up to 15 guests.",
};

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main className="mx-auto max-w-2xl px-4 pb-20 pt-12 sm:px-6">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Create your event</h1>
        <p className="mt-3 text-lg text-zinc-500">
          You get a join link and a QR code to share with your guests. When the doors open, one click gives every guest
          their three hellos.
        </p>
        <div className="mt-8">
          <SavedEvents />
        </div>
        <div className="mt-10">
          <CreateEventForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
