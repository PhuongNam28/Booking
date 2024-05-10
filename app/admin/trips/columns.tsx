"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

export type Trips = {
  id: String;
  image: String;
  title: String;
  description: String;
  locationDescription: String;
  addedAt: Date;
  updatedAt: Date;
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
];
