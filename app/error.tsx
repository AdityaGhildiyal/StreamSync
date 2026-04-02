"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleGoHome = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="h-full flex flex-col space-y-4 items-center justify-center text-muted-foreground">
      <p>
        Something went wrong
      </p>
      <Button variant="secondary" onClick={handleGoHome}>
        Go back home
      </Button>
    </div>
  );
};

export default ErrorPage;