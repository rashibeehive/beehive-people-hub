import { useState } from "react";
import { Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value.endsWith("@beehive.ae")) {
      toast.error("Only Beehive email addresses are allowed");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: value,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Hexagon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-lg font-semibold text-secondary">Beehive</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              People Platform
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h1 className="mb-1 text-xl font-semibold text-secondary">Sign in</h1>
          <p className="mb-5 text-sm text-muted-foreground">
            We'll email you a magic link. Beehive accounts only.
          </p>

          {sent ? (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <div className="font-medium text-secondary">Check your inbox</div>
              <div className="mt-1 text-muted-foreground">
                We sent a magic link to <span className="font-medium">{email}</span>.
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@beehive.ae"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send magic link"}
              </Button>
            </form>
          )}
        </div>

        <div className="mt-4 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          Preview mode: the app loads with Rashi Agarwal's profile until you sign in.
        </div>
      </div>
    </div>
  );
}