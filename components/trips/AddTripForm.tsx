"use client";

import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Trip, RoomTrip, Destination } from "@prisma/client";
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
import AddRoomTripForm from "../roomtrip/AddRoomTripForm";
import RoomTripCard from "../roomtrip/RoomTripCard";
import "react-quill/dist/quill.snow.css"; // Import stylesheet
import { useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface AddTripFormProps {
  trip: TripWithRooms | null;
}

export type TripWithRooms = Trip & {
  roomtrips: RoomTrip[];
};

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
  country: z.string().min(1, {
    message: "Country is required",
  }),
  state: z.string().optional(),
  city: z.string().optional(),
  destinationDetails: z.string().min(10, {
    message: "Description must be atleast 10 characters long",
  }),
  locationDescription: z.string().min(10, {
    message: "Description must be atleast 10 characters long",
  }),
  tourGuide: z.boolean().optional(),
  transportation: z.boolean().optional(),
  supportService: z.boolean().optional(),
  activities: z.boolean().optional(),
  departureTime: z.string(), // Sử dụng kiểu dữ liệu là string cho departureTime
  arrivalTime: z.string(),
  duration: z.string().min(1, {
    message: "duration is required",
  }),
});

const AddTripForm = ({ trip }: AddTripFormProps) => {
  const [image, setImage] = useState<string | undefined>(trip?.image);

  const [imageIsDeleting, setImageIsDeleting] = useState(false);

  const [states, setStates] = useState<IState[]>([]);

  const [cities, setCities] = useState<ICity[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isTripDeleting, setIsTripDeleting] = useState(false);

  const [open, setOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  const isDarkTheme = theme === "dark";

  const [openDestinationDialog, setOpenDestinationDialog] = useState(false);

  const { toast } = useToast();

  const router = useRouter();

  const { getALlCountries, getCountryStates, getStateCities } = useLocation();

  const countries = getALlCountries();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: trip || {
      title: "",
      description: "",
      image: "",
      country: "",
      state: "",
      city: "",
      destinationDetails: "",
      locationDescription: "",
      tourGuide: true,
      transportation: true,
      supportService: true,
      activities: true,
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
    const selectedCountry = form.watch("country");
    const countryStates = getCountryStates(selectedCountry);
    if (countryStates) {
      setStates(countryStates);
    }
    //eslint-disable-next-line
  }, [form.watch("country")]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const selectedState = form.watch("state");
    const stateCities = getStateCities(selectedCountry, selectedState);
    if (stateCities) {
      setCities(stateCities);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("country"), form.watch("state")]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (trip) {
      axios
        .patch(`/api/trip/${trip.id}`, values)
        .then((res) => {
          toast({
            variant: "success",
            description: "Trip Update!",
          });
          router.push(`/trip/${res.data.id}`);
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
        .post("/api/trip", values)
        .then((res) => {
          toast({
            variant: "success",
            description: "Trip created.",
          });
          router.push(`/trip/${res.data.id}`);
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

  const handelDeleteTrip = async (trip: TripWithRooms) => {
    setIsTripDeleting(true);
    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf("/") + 1);
    try {
      const imageKey = getImageKey(trip.image);
      await axios.post("/api/uploadthing/delete", { imageKey });
      await axios.delete(`/api/trip/${trip.id}`);

      setIsTripDeleting(false);
      toast({
        variant: "success",
        description: "Trip Delete!",
      });
      router.push("/trip/new");
    } catch (error: any) {
      console.log(error);
      setIsTripDeleting(false);
      toast({
        variant: "destructive",
        description: `Trip Deletion could not be completed! ${error.message}`,
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

  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleDialogueDestinationOpen = () => {
    setOpenDestinationDialog((prev) => !prev);
  };

  const handleAddHotel = () => {
    // Chuyển hướng đến trang "hotel/new"
    router.push("/trip/new");
  };

  const handleBack = () => {
    // Chuyển hướng đến trang "hotel/new"
    router.back();
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">
            {trip ? "Update your Trip!" : "Describe your Trip!"}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                //title
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Title *</FormLabel>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Trip Tour" {...field} />
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
                    <FormLabel>Trip Description *</FormLabel>
                    <FormDescription>
                      Provide a detailed description of your trip
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Trip Tour is parked with many awesome amenitie!"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // departureTime
                control={form.control}
                name="departureTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date*</FormLabel>
                    <FormDescription>
                      Enter the startDate time of the trip
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
                    <FormLabel>End Date *</FormLabel>
                    <FormDescription>
                      Enter the endDate time of the trip
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
                      Enter the duration of the trip (in days)
                    </FormDescription>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Choose Amenities</FormLabel>
                <FormDescription>
                  Choose Amenities popular in your Trip
                </FormDescription>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <FormField
                    //tourGuide
                    control={form.control}
                    name="tourGuide"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Tour Guide</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    //transportation
                    control={form.control}
                    name="transportation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Transportation</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    //supportService
                    control={form.control}
                    name="supportService"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Support Service</FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    //activities
                    control={form.control}
                    name="activities"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Activities</FormLabel>

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
                      Choose an image that will show-case your trip nicely
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
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Country *</FormLabel>
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

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select State *</FormLabel>
                      <FormDescription>
                        In which state is your property located
                      </FormDescription>
                      <Select
                        disabled={isLoading || states.length < 1}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            placeholder="Select a State"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => {
                            return (
                              <SelectItem
                                key={state.isoCode}
                                value={state.isoCode}
                              >
                                {state.name}
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
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select City *</FormLabel>
                    <FormDescription>
                      In which town/city is your property located
                    </FormDescription>
                    <Select
                      disabled={isLoading || cities.length < 1}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          placeholder="Select a City"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => {
                          return (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Description *</FormLabel>
                    <FormDescription>
                      Provide a detaied location description of your hotel
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Located at the very end of the beach road!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destinationDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Details *</FormLabel>
                    <FormDescription>
                      Provide a detailed location description of your hotel
                    </FormDescription>
                    <FormControl>
                      <ReactQuill
                        placeholder="Located at the very end of the beach road!"
                        value={field.value}
                        onChange={field.onChange}
                        style={{
                          height: "300px",
                          backgroundColor: isDarkTheme ? "#333" : "#fff", // Thay đổi màu nền tùy theo chủ đề
                          color: isDarkTheme ? "#fff" : "#333", // Thay đổi màu chữ tùy theo chủ đề
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {trip && !trip.roomtrips.length && (
                <Alert className="bg-indigo-600 text-white">
                  <Terminal className="h-4 w-4 stroke-white" />
                  <AlertTitle>One last step!</AlertTitle>
                  <AlertDescription>
                    Your Trip was created successfully
                    <div>
                      Please add some rooms to complete our your trip setup!
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex justify-between gap-2 flex-wrap mt-10">
                {trip && (
                  <Button
                    onClick={() => handelDeleteTrip(trip)}
                    variant="ghost"
                    type="button"
                    className="max-w-[150px]"
                    disabled={isTripDeleting || isLoading}
                  >
                    {isTripDeleting ? (
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

                {trip && (
                  <Button
                    onClick={() => router.push(`/trip-details/${trip.id}`)}
                    type="button"
                    variant="outline"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                )}

                {trip && (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                      <Button
                        type="button"
                        variant="outline"
                        className="max-w-[150px]"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Room Trip
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[900px] w-[90%]">
                      <DialogHeader className="px-2">
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          Add details about a room in your hotel
                        </DialogDescription>
                      </DialogHeader>
                      <AddRoomTripForm
                        trip={trip}
                        handleDialogueOpen={handleDialogueOpen}
                      />
                    </DialogContent>
                  </Dialog>
                )}

                {trip ? (
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
                    <Button
                      className="max-w-[150px] mt-10"
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
                          Create Trip
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
              {trip && !!trip.roomtrips.length && (
                <div>
                  <Separator />
                  <h3 className="text-lg font-semibold my-4">Trip Rooms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trip.roomtrips.map((roomtrip) => {
                      return (
                        <RoomTripCard
                          key={roomtrip.id}
                          trip={trip}
                          roomtrip={roomtrip}
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
        <Button onClick={handleAddHotel}>Add Trip</Button>
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
export default AddTripForm;
