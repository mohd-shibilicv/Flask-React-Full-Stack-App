import { useEffect, useState } from "react";
import "./App.css";
import ContactList from "./components/ContactList";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "./components/ThemeProvider";
import { ModeToggle } from "./components/ModeToggle";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();
    setContacts(data.contacts);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-white dark:bg-black">
          <div className="text-right pt-3 mr-5">
            <ModeToggle />
          </div>
          <ContactList fetchContacts={fetchContacts} contacts={contacts} />
        </div>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;
