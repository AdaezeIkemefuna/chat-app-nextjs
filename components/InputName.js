import { useState } from "react";
import { useRouter } from "next/router";
export default function Modal() {
  const router = useRouter();
  const [name, setName] = useState("");
  const setNameHandler = (e) => {
    e.preventDefault();
    localStorage.setItem("username", name);
    router.push("/chat");
  };
  return (
    <div className="backdrop">
      <div className="modal__center">
        <>
          <h1>Please Enter Your Name:</h1>
          <form onSubmit={setNameHandler}>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <button disabled={name === ""}>Go</button>
          </form>
        </>
      </div>
    </div>
  );
}
