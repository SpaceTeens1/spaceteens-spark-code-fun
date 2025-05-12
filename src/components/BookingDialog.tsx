
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";

import { Button } from "@/components/ui/button";
import { FireworksButton } from "@/components/FireworksButton";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Rocket, Sparkles } from "lucide-react";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  date: z.date({
    required_error: "Please select a date for your booking.",
  }),
  time: z.string({
    required_error: "Please select a time for your booking.",
  }),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof FormSchema>;

type BookingDialogProps = {
  triggerComponent?: React.ReactNode;
};

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", 
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export function BookingDialog({ triggerComponent }: BookingDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(data: BookingFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Booking successful!",
        description: `Your session is scheduled for ${format(data.date, "PPP")} at ${data.time}`,
      });
      
      setIsSubmitting(false);
      setOpen(false);
      form.reset();
    }, 1500);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerComponent ? (
          triggerComponent
        ) : (
          <FireworksButton className="bg-spaceteens-orange hover:bg-spaceteens-orange/90 transition-all duration-300 shadow-lg hover:shadow-spaceteens-orange/20 hover:-translate-y-0.5 rounded-full">
            <Rocket className="mr-2 h-4 w-4" />
            {t('nav.bookNow')}
          </FireworksButton>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-white to-spaceteens-teal/5 backdrop-blur-sm border border-white/20 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-spaceteens-blue">
            <Sparkles className="h-5 w-5 text-spaceteens-orange" />
            {t('booking.title')}
          </DialogTitle>
          <DialogDescription>
            {t('booking.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('booking.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('booking.namePlaceholder')} {...field} />
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
                    <FormLabel>{t('booking.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('booking.emailPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('booking.date')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t('booking.datePlaceholder')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('booking.time')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('booking.timePlaceholder')} />
                          <Clock className="ml-auto h-4 w-4 opacity-50" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('booking.message')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('booking.messagePlaceholder')} 
                      className="resize-none" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <FireworksButton 
                type="submit" 
                disabled={isSubmitting}
                className="bg-spaceteens-orange hover:bg-spaceteens-orange/90 w-full md:w-auto rounded-full transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-spaceteens-orange/20"
              >
                <Rocket className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                {isSubmitting ? t('booking.submitting') : t('booking.submit')}
              </FireworksButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
