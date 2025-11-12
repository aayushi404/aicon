import Image from "next/image";
import { Card, CardContent } from "./ui/card";

export default function Screen({ imageUrl }: { imageUrl: string | null }) {
    
    if (imageUrl) {
        return (
            <Card>
                <CardContent>
                    <Image src={imageUrl} alt="" width={300} height={300}/>
                </CardContent>
            </Card>
        )
    }
}