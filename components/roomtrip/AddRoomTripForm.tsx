"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trip, RoomTrip } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import * as z from "zod";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Loader2, Pencil, PencilLine, XCircle } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "../uploadthing";
import { useRouter } from "next/navigation";

interface AddRoomTripFormProps {
  trip?: Trip & {
    roomtrips: RoomTrip[];
  };
  roomtrip?: RoomTrip;
  handleDialogueOpen: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }),
  bedCount: z.number().min(1, { message: "Bed count is required!" }),
  guestCount: z.number().min(1, { message: "Guest count is required!" }),
  bathroomCount: z.number().min(1, { message: "Bathroom count is required!" }),
  kingBed: z.number().min(0),
  queenBed: z.number().min(0),
  image: z.string().min(1, {
    message: "Image is required",
  }),
  breakFastPrice: z.number().optional(),
  roomPrice: z.number().min(1, { message: "Room price is required!" }),
  roomService: z.boolean().optional(),
  TV: z.boolean().optional(),
  balcony: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  cityView: z.boolean().optional(),
  oceanView: z.boolean().optional(),
  forestView: z.boolean().optional(),
  mountainView: z.boolean().optional(),
  airCondition: z.boolean().optional(),
  soundProofed: z.boolean().optional(),
  member: z.number().default(0),
  availableSeats: z
    .number()
    .min(1, { message: "Available Seats is required!" }),
});

const AddRoomTripForm = ({
  trip,
  roomtrip,
  handleDialogueOpen,
}: AddRoomTripFormProps) => {
  const [image, setImage] = useState<string | undefined>(roomtrip?.image);

  const [imageIsDeleting, setImageIsDeleting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: roomtrip || {
      title: "",
      description: "",
      bedCount: 0,
      guestCount: 0,
      bathroomCount: 0,
      kingBed: 0,
      queenBed: 0,
      image: "",
      breakFastPrice: 0,
      roomPrice: 0,
      roomService: true,
      TV: true,
      balcony: true,
      freeWifi: true,
      cityView: true,
      oceanView: true,
      forestView: true,
      mountainView: true,
      airCondition: true,
      soundProofed: true,
      availableSeats: 0,
      member: 0,
    },
  });

  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
    //eslint-disable-next-line
  }, [image]);

  const handleImageDelete = (image: string) => {
    setImageIsDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage("");
          toast({
            variant: "success",
            description: "Image removed",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      })
      .finally(() => {
        setImageIsDeleting(false);
      });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (trip && roomtrip) {
      axios
        .patch(`/api/roomtrip/${roomtrip.id}`, values)
        .then((res) => {
          toast({
            variant: "success",
            description: "Room Update!",
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Some thing went wrong!",
          });
          setIsLoading(false);
        });
    } else {
      if (!trip) return;
      axios

        .post("/api/roomtrip", { ...values, tripId: trip.id })
        .then((res) => {
          toast({
            variant: "success",
            description: "Room created.",
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Some thing went wrong!",
          });
          setIsLoading(false);
        });
    }
  }

  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            //RoomTitle
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Title *</FormLabel>
                <FormDescription>Provide a room name.</FormDescription>
                <FormControl>
                  <Input placeholder="Double Room" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            //description
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Description *</FormLabel>
                <FormDescription>
                  Is there anything special about this room.
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Have a beautiful view of the ocean while in this room!"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Choose Amenities</FormLabel>
            <FormDescription>
              What makes this room a good choice
            </FormDescription>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <FormField
                //roomService
                control={form.control}
                name="roomService"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>24hrs Room Service</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //TV
                control={form.control}
                name="TV"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>TV</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //balcony
                control={form.control}
                name="balcony"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Balcony</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //freeWifi
                control={form.control}
                name="freeWifi"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Free Wifi</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //cityView
                control={form.control}
                name="cityView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>City View</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //oceanView
                control={form.control}
                name="oceanView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Ocean View</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //forestView
                control={form.control}
                name="forestView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Forest View</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //mountainView
                control={form.control}
                name="mountainView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Mountain View</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //airCondition
                control={form.control}
                name="airCondition"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Air Conditioned</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //soundProofed
                control={form.control}
                name="soundProofed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Sound Proofed</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            //image
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>Upload an Image</FormLabel>
                <FormDescription>
                  Choose an image that will show-case your room nicely
                </FormDescription>
                <FormControl>
                  {image ? (
                    <>
                      <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                        <Image
                          fill
                          src={image}
                          alt="Hotel Image"
                          className="object-contain"
                        />
                        <Button
                          onClick={() => handleImageDelete(image)}
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="absolute right-[-12px] top-0"
                        >
                          {imageIsDeleting ? <Loader2 /> : <XCircle />}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="flex flex-col items-center max-w-[4000px] p-12 border-2 border-dashed
                          border-primary/50 rounded mt-4"
                      >
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            console.log("Files: ", res);
                            setImage(res[0].url);
                            toast({
                              variant: "success",
                              description: "Upload Completed",
                            });
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </div>
                    </>
                  )}
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                //roomPrice
                control={form.control}
                name="roomPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Price in USD *</FormLabel>
                    <FormDescription>
                      State the price for staying in this room for 24hrs
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(parseFloat(value));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //member
                control={form.control}
                name="member"
                render={({ field }) => (
                  <FormItem style={{ display: "none" }}>
                    <Input
                      type="hidden"
                      min={0}
                      {...field}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(parseFloat(value));
                      }}
                    />
                  </FormItem>
                )}
              />

              <FormField
                //availableSeats
                control={form.control}
                name="availableSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Seats in Trip *</FormLabel>
                    <FormDescription>State the available seats</FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(parseFloat(value));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //bedCount
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Count *</FormLabel>
                    <FormDescription>
                      How many beds are available in this room
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(parseFloat(value));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //guestCount
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Count *</FormLabel>
                    <FormDescription>
                      How many guest are allowed in this room.
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(parseFloat(value));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                //bathroomCount
                control={form.control}
                name="bathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathroom Count *</FormLabel>
                    <FormDescription>
                      How many bathrooms are allowed in this room.
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(parseFloat(value));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                //breakFastPrice
                control={form.control}
                name="breakFastPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BreakFast Price in USD *</FormLabel>
                    <FormDescription>
                      State the price for breakfast in this room.
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(parseFloat(value));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //kingBed
                control={form.control}
                name="kingBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>King Beds *</FormLabel>
                    <FormDescription>
                      How many king beds are available in this room
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(parseFloat(value));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //queenBed
                control={form.control}
                name="queenBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queen Bed *</FormLabel>
                    <FormDescription>
                      How many queen beds are this room.
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(parseFloat(value));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="pt-4 pb-2">
            {roomtrip ? (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                type="button"
                className="max-w-[150px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Updating
                  </>
                ) : (
                  <>
                    <PencilLine className="mr-2 h-4 w-4" />
                    Update
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  type="button"
                  className="max-w-[150px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4" />
                      Creating
                    </>
                  ) : (
                    <>
                      <Pencil className="mr-2 h-4 w-4" />
                      Create Room
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRoomTripForm;
