import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(4, {
    message: "First name must be at least 3 characters.",
  }),
  last_name: z.string().min(4, {
    message: "Last name must be at least 4 characters.",
  }),
  email: z.string().regex(/^[\w\.-]+@[\w\.-]+\.\w+$/, {
    message: "Enter a valid email address.",
  }),
});

const ContactList = ({ fetchContacts, contacts }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenUpdateDialog = () => {
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  const updateForm = useForm({
    resolver: zodResolver(formSchema),
    values: {
      first_name: selectedContact.firstName,
      last_name: selectedContact.lastName,
      email: selectedContact.email,
    },
  });

  const onSubmit = async (values) => {
    const data = {
      firstName: values.first_name,
      lastName: values.last_name,
      email: values.email,
    };
    const url = "http://127.0.0.1:5000/create_contact";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    if (response.status !== 201 && response.status !== 200) {
      const data = await response.json();
      handleClose();
      toast({
        title: "Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(data.message, null, 2)}
            </code>
          </pre>
        ),
      });
    } else {
      const data = await response.json();
      fetchContacts();
      handleClose();
      toast({
        title: "Success",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(data.message, null, 2)}
            </code>
          </pre>
        ),
      });
    }
  };

  const onUpdateSelect = (contact) => {
    handleOpenUpdateDialog();
    setSelectedContact(contact);
  };

  const onUpdate = async (values) => {
    try {
      const url = `http://127.0.0.1:5000/update_contact/${selectedContact?.id}`;
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        }),
      };
      const response = await fetch(url, options);
      if (response.status === 200) {
        handleCloseUpdateDialog();
        fetchContacts();
        toast({
          title: "Success",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">Successfully updated!</code>
            </pre>
          ),
        });
      } else {
        toast({
          title: "Error",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">Failed to delete!</code>
            </pre>
          ),
        });
      }
    } catch (error) {
      toast({
        title: `Error`,
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{error}</code>
          </pre>
        ),
      });
    }
  };

  const onDelete = async (id) => {
    try {
      const url = `http://127.0.0.1:5000/delete_contact/${id}`;
      const options = {
        method: "DELETE",
      };
      const response = await fetch(url, options);
      if (response.status === 204) {
        fetchContacts();
        toast({
          title: "Success",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">Successfully deleted!</code>
            </pre>
          ),
        });
      } else {
        toast({
          title: "Error",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">Failed to delete!</code>
            </pre>
          ),
        });
      }
    } catch (error) {
      toast({
        title: `Error`,
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{error}</code>
          </pre>
        ),
      });
    }
  };

  return (
    <>
      <div>
        <Table>
          <TableHeader>
            <TableRow className="text-black dark:text-white">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead className="text-right">Email</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} className="text-black dark:text-white">
                <TableCell className="font-medium">{contact.id}</TableCell>
                <TableCell className="">{contact.firstName}</TableCell>
                <TableCell className="">{contact.lastName}</TableCell>
                <TableCell className="text-right">{contact.email}</TableCell>
                <TableCell className="text-center">
                  <Dialog>
                    <DialogTrigger
                      className="bg-white dark:bg-black dark:text-white mr-2 border rounded-lg hover:border-blue-600 hover:text-blue-900 dark:hover:text-blue-900 p-2"
                      onClick={() => onUpdateSelect(contact)}
                    >
                      Update
                    </DialogTrigger>
                    {openUpdateDialog && (
                      <DialogContent className="dark:text-white">
                        <DialogHeader>
                          <DialogTitle className="mb-5">
                            Update the Contact
                          </DialogTitle>
                          <Form {...updateForm}>
                            <form
                              onSubmit={updateForm.handleSubmit(onUpdate)}
                              className="space-y-8"
                            >
                              <FormField
                                control={updateForm.control}
                                name="first_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your First Name"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={updateForm.control}
                                name="last_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your Last Name"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={updateForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your Email"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="submit">Submit</Button>
                            </form>
                          </Form>
                          <DialogDescription></DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    )}
                  </Dialog>
                  <Button
                    className="!bg-white dark:!bg-black dark:!text-white !text-black mr-2 border rounded-lg hover:border-red-600 hover:!text-red-900 dark:hover:!text-red-900 p-2"
                    onClick={() => onDelete(contact.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Contact Create Dialog */}
        <Dialog>
          <DialogTrigger
            className="flex items-center justify-center gap-2 font-semibold w-full p-2 border border-dotted rounded-md border-black dark:text-white dark:border-white"
            onClick={handleOpen}
          >
            Create a New Contact <Plus size={18} />
          </DialogTrigger>
          {open && (
            <DialogContent className="dark:text-white">
              <DialogHeader>
                <DialogTitle className="mb-5">Create a New Contact</DialogTitle>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>First Name</FormLabel> */}
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>Last Name</FormLabel> */}
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>Email</FormLabel> */}
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
                <DialogDescription></DialogDescription>
              </DialogHeader>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </>
  );
};

export default ContactList;
