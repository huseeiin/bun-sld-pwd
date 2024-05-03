import { Title } from "@solidjs/meta";
import { action, useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import "./style.css";
import { password } from "bun";

const hash = action(async (formData: FormData) => {
  "use server";

  const pwd = formData.get("password");

  if (typeof pwd === "string") {
    return { hash: await password.hash(pwd) };
  }
});

const verify = action(async (formData: FormData) => {
  "use server";

  const pwd = formData.get("password");
  const hash = formData.get("hash");

  if (typeof pwd === "string" && typeof hash === "string") {
    return { result: await password.verify(pwd, hash) };
  }
});

export default function Home() {
  const hashForm = useSubmission(hash);
  const verifyForm = useSubmission(verify);

  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Show when={hashForm.result}>
        <p>{hashForm.result?.hash}</p>
      </Show>
      <form method="post" action={hash}>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button>Hash</button>
      </form>
      <Show when={verifyForm.result}>
        <p>{verifyForm.result?.result.toString()}</p>
      </Show>
      <form method="post" action={verify}>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <input type="password" name="hash" placeholder="Hash" required />
        <button>Verify</button>
      </form>
    </main>
  );
}
