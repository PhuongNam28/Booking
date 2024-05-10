"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

export type Flight = {
  id: String;
  name: String;
  description: String;
  fromCountry: String;
  toCountry: String;
  duration: String;
  addedAt: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<Flight>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },

  {
    accessorKey: "fromCountry",
    header: "FromCountry",
  },

  {
    accessorKey: "toCountry",
    header: "ToCountry",
  },

  {
    accessorKey: "duration",
    header: "Duration",
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
