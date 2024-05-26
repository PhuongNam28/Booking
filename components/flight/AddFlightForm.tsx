"use client";

import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Flight, typeFlight } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { UploadButton } from "../uploadthing";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Eye,
  Loader2,
  Pencil,
  PencilLine,
  Plus,
  Terminal,
  Trash,
  XCircle,
} from "lucide-react";
import axios from "axios";
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import AddTypeForm from "../type/AddTypeForm";
import RoomTypeCard from "../type/RoomTypeCard";

interface AddFlightFormProps {
  flight: FlightWithRooms | null;
}

export type FlightWithRooms = Flight & {
  types: typeFlight[];
};

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Description must be atleast 3 characters long",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
  description: z.string().min(10, {
    message: "Description must be atleast 10 characters long",
  }),
  fromCountry: z.string().min(1, {
    message: "Country is required",
  }),
  toCountry: z.string().min(1, {
    message: "Country is required",
  }),
  departureTime: z.string(), // Sử dụng kiểu dữ liệu là string cho departureTime
  arrivalTime: z.string(),
  duration: z.string().min(1, {
    message: "duration is required",
  }),
});

const AddFlightForm = ({ flight }: AddFlightFormProps) => {
  const [image, setImage] = useState<string | undefined>(flight?.image);

  const [imageIsDeleting, setImageIsDeleting] = useState(false);

  const [states, setStates] = useState<IState[]>([]);

  const [cities, setCities] = useState<ICity[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isHotelDeleting, setIsHotelDeleting] = useState(false);

  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const router = useRouter();

  const { getALlCountries, getCountryStates, getStateCities } = useLocation();

  const countries = getALlCountries();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: flight || {
      name: "",
      image: "",
      fromCountry: "",
      toCountry: "",
      departureTime: "", // Chuyển đổi sang kiểu Date
      arrivalTime: "", // Chuyển đổi sang kiểu Date
      duration: "", // Thêm trường này với giá trị mặc định
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

  useEffect(() => {
    const selectedCountryFrom = form.watch("fromCountry");
    const countryStatesFrom = getCountryStates(selectedCountryFrom);
    if (countryStatesFrom) {
      setStates(countryStatesFrom);
    }
    //eslint-disable-next-line
  }, [form.watch("fromCountry")]);

  useEffect(() => {
    const selectedCountryTo = form.watch("toCountry");
    const countryStatesTo = getCountryStates(selectedCountryTo);
    if (countryStatesTo) {
      setStates(countryStatesTo);
    }
    //eslint-disable-next-line
  }, [form.watch("toCountry")]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (flight) {
      axios
        .patch(`/api/flight/${flight.id}`, values)
        .then((res) => {
          toast({
            variant: "success",
            description: "Flight Update!",
          });
          router.push(`/flight/${res.data.id}`);
          setIsLoading(false);
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
      axios
        .post("/api/flight", values)
        .then((res) => {
          toast({
            variant: "success",
            description: "Flight created.",
          });
          router.push(`/flight/${res.data.id}`);
          setIsLoading(false);
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

  const handelDeleteFlight = async (flight: FlightWithRooms) => {
    setIsHotelDeleting(true);
    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf("/") + 1);
    try {
      const imageKey = getImageKey(flight.image);
      await axios.post("/api/uploadthing/delete", { imageKey });
      await axios.delete(`/api/flight/${flight.id}`);

      setIsHotelDeleting(false);
      toast({
        variant: "success",
        description: "Flight Delete!",
      });
      router.push("/flight/new");
    } catch (error: any) {
      console.log(error);
      setIsHotelDeleting(false);
      toast({
        variant: "destructive",
        description: `Flight Deletion could not be completed! ${error.message}`,
      });
    }
  };

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

  const handleAddFlight = () => {
    // Chuyển hướng đến trang "hotel/new"
    router.push("/flight/new");
  };

  const handleBack = () => {
    // Chuyển hướng đến trang "hotel/new"
    router.back();
  };

  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">
            {flight ? "Update your Flight!" : "Describe your Flight!"}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                //name
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flight Title *</FormLabel>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Flight" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //image
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-3">
                    <FormLabel>Upload an Image</FormLabel>
                    <FormDescription>
                      Choose an image that will show-case your hotel nicely
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

              <FormField
                // departureTime
                control={form.control}
                name="departureTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Time *</FormLabel>
                    <FormDescription>
                      Enter the departure time of the flight
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value?.toString().slice(0, 16)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // arrivalTime
                control={form.control}
                name="arrivalTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arrival Time *</FormLabel>
                    <FormDescription>
                      Enter the arrival time of the flight
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value?.toString().slice(0, 16)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // duration
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration *</FormLabel>
                    <FormDescription>
                      Enter the duration of the flight (in hours)
                    </FormDescription>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  //fromCountry
                  control={form.control}
                  name="fromCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select From Country *</FormLabel>
                      <FormDescription>
                        In which country is your property located
                      </FormDescription>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            placeholder="Select a Country"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => {
                            return (
                              <SelectItem
                                key={country.isoCode}
                                value={country.isoCode}
                              >
                                {country.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  //toCountry
                  control={form.control}
                  name="toCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select To Country *</FormLabel>
                      <FormDescription>
                        In which country is your property located
                      </FormDescription>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            placeholder="Select a Country"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => {
                            return (
                              <SelectItem
                                key={country.isoCode}
                                value={country.isoCode}
                              >
                                {country.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                //description
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fligt Description *</FormLabel>
                    <FormDescription>
                      Provide a detailed description of your hotel
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="flight Description" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {flight && !flight.types.length && (
                <Alert className="bg-indigo-600 text-white">
                  <Terminal className="h-4 w-4 stroke-white" />
                  <AlertTitle>One last step!</AlertTitle>
                  <AlertDescription>
                    Your hotel was created successfully
                    <div>
                      Please add some rooms to complete our your hotel setup!
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex justify-between gap-2 flex-wrap">
                {flight && (
                  <Button
                    onClick={() => handelDeleteFlight(flight)}
                    variant="ghost"
                    type="button"
                    className="max-w-[150px]"
                    disabled={isHotelDeleting || isLoading}
                  >
                    {isHotelDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" />
                        Deleting
                      </>
                    ) : (
                      <>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                )}

                {flight && (
                  <Button
                    onClick={() => router.push(`/flight-details/${flight.id}`)}
                    type="button"
                    variant="outline"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                )}

                {flight && (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                      <Button
                        type="button"
                        variant="outline"
                        className="max-w-[150px]"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Type
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[900px] w-[90%]">
                      <DialogHeader className="px-2">
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          Add details about a room in your flight
                        </DialogDescription>
                      </DialogHeader>
                      <AddTypeForm
                        flight={flight}
                        handleDialogueOpen={handleDialogueOpen}
                      />
                    </DialogContent>
                  </Dialog>
                )}

                {flight ? (
                  <Button className="max-w-[150px]" disabled={isLoading}>
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
                    <Button className="max-w-[150px]" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4" />
                          Creating
                        </>
                      ) : (
                        <>
                          <Pencil className="mr-2 h-4 w-4" />
                          Create Flight
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
              {flight && !!flight.types.length && (
                <div>
                  <Separator />
                  <h3 className="text-lg font-semibold my-4">Flight Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {flight.types.map((type) => {
                      return (
                        <RoomTypeCard
                          key={type.id}
                          flight={flight}
                          type={type}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
      <div className="flex gap-2 mt-10">
        {" "}
        {/* Đặt các nút trong một div */}
        <Button onClick={handleAddFlight}>Add Flight</Button>
        <Button
          onClick={handleBack}
          variant="ghost"
          className="text-gray-500 hover:text-gray-700 border border-gray-500 rounded-md"
        >
          Back
        </Button>
      </div>
    </div>
  );
};
export default AddFlightForm;
