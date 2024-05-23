"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import axios from "axios"; // Import axios
import { useRouter } from "next/navigation";

export type Trips = {
  id: string;
  image: string;
  title: string;
  description: string;
  locationDescription: string;
  addedAt: Date;
  updatedAt: Date;
};

// Define a functional component that contains handleUpdate
const UpdateButton = ({ id }: { id: string }) => {
  const router = useRouter();

  const handleUpdate = () => {
    router.push(`/trip/${id}`);
  };

  return <Button onClick={handleUpdate}>Update</Button>;
};
// Function to handle delete action
const handleDelete = async (id: string) => {
  try {
    // Send DELETE request to your API to delete the item with the specified ID
    const response = await axios.delete(`/api/trip/${id}`);
    console.log("Response from delete:", response.data);
    // Handle success, show a success message or perform any other action
    window.location.reload(); // Reload the page
  } catch (error) {
    // Handle error, show an error message or perform any other action
    console.error("Error deleting item:", error);
  }
};

export const columns: ColumnDef<Trips>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },

  {
    accessorKey: "locationDescription",
    header: "Location",
  },

  {
    accessorKey: "addedAt",
    header: "AddAt",
  },

  {
    accessorKey: "updatedAt",
    header: "UpdateAt",
  },

  // Action column: Update and Delete
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <UpdateButton id={row.original.id} />
        <Button
          onClick={() => handleDelete(row.original.id)} // Thay handleDelete bằng hàm xử lý xóa
        >
          Delete
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

// Function to handle update action
