"use client"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Field, FieldGroup, FieldContent, FieldDescription, FieldError, FieldLabel, FieldSet, FieldTitle, FieldSeparator, FieldLegend } from "./ui/field";
import { useForm, SubmitHandler, Controller } from "react-hook-form" 
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "./ui/card";
import { toast } from "sonner";
import generateImage from "@/app/playground/actions";
const style = [
    {
        id: "classic",
        title: "classic", 
        description:""
    },
    {
        id: "glass",
        title: "glass",
        description:""
    },
    {
        id: "minimalistic",
        title: "minimalistic",
        description:""
    },
    {
        id: "3d",
        title: "3d",
        description:""
    }
]
const formSchema = z.object({
    description: z.string().min(1, "You must describe your project so that AI can have context about your icon"),
    style: z.string().min(1, "Please select the theme or style of your icon"),
    prompt: z.string().min(10, "Please write a detailed prompt to generate a good response").max(1000, "Prompt is too big use generate prompt")
})

export default function PromptSettings({ setImageUrl }: { setImageUrl: (url: string) => void }) {
    // need to take image type from state store
    const type = 'ICON'
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            style: "classic",
            prompt:""
        }
    })

    const onsubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
        try {
            const imageUrl = await generateImage({ ...data, type: type })
            if (!imageUrl) {
                throw new Error("cannot find the image")
            }
            setImageUrl(imageUrl)
        } catch (error) {
            if (error instanceof Error) {
                console.log(error)
                toast("error while generating the image")
            }
        }
    }

    return (
        <Card className="w-1/2 ml-5 p-3">
            <CardHeader className="border-b">
                <CardTitle>You&apos;re almost there!</CardTitle>
                <CardDescription>
                Help AI to generate your icon
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="icon-generation-form" onSubmit={form.handleSubmit(onsubmit)}>
                    <FieldGroup>
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                const invalid = fieldState.invalid
                                return (
                                    <Field aria-invalid={invalid}>
                                        <FieldLabel htmlFor="icon-generation-description">Icon Description</FieldLabel>
                                        <FieldDescription>Describe your application or idea where you want to use your icon</FieldDescription>
                                        <Input
                                            {...field}
                                            id="icon-generation-description"
                                            aria-invalid={invalid}
                                            placeholder="icon is for a real state company"
                                        />
                                        {invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                        <FieldSeparator />
                        <Controller
                            name="style"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                const invalid = fieldState.invalid
                                return (
                                    <FieldSet aria-invalid={invalid} className="border">
                                        <FieldLegend>Style</FieldLegend>
                                        <FieldDescription>Choose a theme for your icon</FieldDescription>
                                        
                                        <RadioGroup
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            aria-invalid={invalid}
                                            className=""
                                        >   
                                            <Carousel
                                                opts={{
                                                    align: "center",
                                                }}
                                                className="w-fit border"
                                            >
                                                <Style invalid={ invalid } />
                                                </Carousel>
                                        </RadioGroup>
                                        {invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </FieldSet>
                                )
                            }}
                        />
                        <Controller
                            name="prompt"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                const invalid = fieldState.invalid
                                return (
                                    <Field>
                                        <FieldLabel htmlFor="icon-generation-prompt">
                                            Prompt
                                        </FieldLabel>
                                        <FieldDescription>write a detailed prompt for icon generation</FieldDescription>
                                        <Textarea
                                            {...field}
                                            id="icon-generation-prompt"
                                            aria-invalid={invalid}
                                            placeholder="Create an icon for real estate business..."
                                            className="min-h-[120px]"
                                        />
                                        {invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
             <CardFooter className="border-t">
                <Field>
                <Button type="submit" form="icon-generation-form">
                    Submit
                </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}

function Style({invalid}:{invalid:boolean}) {
    return (
    <>
        <CarouselContent>
            {style.map((s, idx) => (
                <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3 ">
                    <FieldLabel htmlFor={`icon-generation-style-${s.id}`}>
                        <Field aria-invalid={invalid}>
                            <FieldContent>
                                <FieldTitle>{ s.title }</FieldTitle>
                            </FieldContent>
                            <RadioGroupItem
                                value={s.id} id={`icon-generation-style-${s.id}`}
                                aria-invalid={invalid}
                            />
                        </Field>
                    </FieldLabel>
                </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
    </>
  )
}
