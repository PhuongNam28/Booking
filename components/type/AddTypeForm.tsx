"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Flight, typeFlight } from "@prisma/client";
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

interface AddTypeFormProps {
  flight?: Flight & {
    types: typeFlight[];
  };
  type?: typeFlight;
  handleDialogueOpen: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Description must be atleast 3 characters long",
  }),
  description: z.string().min(10, {
    message: "Description must be atleast 10 characters long",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
  breakFastPrice: z.coerce.number().optional(),
  adultCount: z.number().default(0),
  childrenCount: z.number().default(0),
  roomPrice: z.coerce.number().min(1, { message: "Room price is required!" }),
  availableSeats: z.coerce
    .number()
    .min(1, { message: "Available Seats is required!" }),
  roomService: z.boolean().optional(),
  TV: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  serviceMeal: z.boolean().optional(),
  serviceBaggage: z.boolean().optional(),
  seatSelection: z.boolean().optional(),
  priorityBoarding: z.boolean().optional(),
  loungeAccess: z.boolean().optional(),
  luxuryMeal: z.boolean().optional(),
  limousine: z.boolean().optional(),
  personalButler: z.boolean().optional(),
});

const AddTypeForm = ({
  flight,
  type,
  handleDialogueOpen,
}: AddTypeFormProps) => {
  const [image, setImage] = useState<string | undefined>(type?.image);

  const [imageIsDeleting, setImageIsDeleting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: type || {
      title: "",
      description: "",
      image: "",
      breakFastPrice: 0,
      adultCount: 0,
      childrenCount: 0,
      roomPrice: 0,
      availableSeats: 0,
      roomService: true,
      TV: true,
      freeWifi: true,
      serviceMeal: true,
      serviceBaggage: true,
      seatSelection: true,
      priorityBoarding: true,
      loungeAccess: true,
      luxuryMeal: true,
      limousine: true,
      personalButler: true,
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
    if (flight && type) {
      axios
        .patch(`/api/type/${type.id}`, values)
        .then((res) => {
          toast({
            variant: "success",
            description: "TypeFlight Update!",
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
      if (!flight) return;
      axios

        .post("/api/type", { ...values, flightId: flight.id })
        .then((res) => {
          toast({
            variant: "success",
            description: "Type created.",
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
                <FormLabel>Type Title *</FormLabel>
                <FormDescription>Provide a type name.</FormDescription>
                <FormControl>
                  <Input placeholder="Type Flight" {...field} />
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
                <FormLabel>Type Description *</FormLabel>
                <FormDescription>
                  Is there anything special about this type.
                </FormDescription>
                <FormControl>
                  <Textarea placeholder="Have a type flight" {...field} />
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
                //serviceMeal
                control={form.control}
                name="serviceMeal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Service Meal(N)</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //serviceBaggage
                control={form.control}
                name="serviceBaggage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Service Baggage(N)</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                //seatSelection
                control={form.control}
                name="seatSelection"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Seat Selection(N)</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //priorityBoarding
                control={form.control}
                name="priorityBoarding"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Priority Boarding(N)</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //loungeAccess
                control={form.control}
                name="loungeAccess"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Lounge Access(V)</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                //luxuryMeal
                control={form.control}
                name="luxuryMeal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Luxury Meal(V)</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //limousine
                control={form.control}
                name="limousine"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Limousine(V)</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //personalButler
                control={form.control}
                name="personalButler"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Personal Butler(V)</FormLabel>

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
                          alt="type Image"
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
                    <FormLabel>Type Price in USD *</FormLabel>
                    <FormDescription>State the price for type</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //availableSeats
                control={form.control}
                name="availableSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Seats in Flight *</FormLabel>
                    <FormDescription>State the available seats</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                //breakFastPrice
                control={form.control}
                name="breakFastPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BreakFast Price in USD *</FormLabel>
                    <FormDescription>
                      State the price for breakfast
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //adultCount
                control={form.control}
                name="adultCount"
                render={({ field }) => (
                  <FormItem style={{ display: "none" }}>
                    <Input type="hidden" {...field} value={0} />
                  </FormItem>
                )}
              />

              <FormField
                //childrenCount
                control={form.control}
                name="childrenCount"
                render={({ field }) => (
                  <FormItem style={{ display: "none" }}>
                    <Input type="hidden" {...field} value={0} />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="pt-4 pb-2">
            {type ? (
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
                      Create Type
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

export default AddTypeForm;
