import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";

const MessageImagesDialog = ({
  fileUrls,
  isDialogOpen,
  setIsDialogOpen,
  setCarouselApi,
}: {
  fileUrls: string[];
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  setCarouselApi: (carouselApi: CarouselApi) => void;
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-[90vw] h-[90vh]">
        <DialogTitle>Image Preview</DialogTitle>
        <Carousel setApi={setCarouselApi}>
          <CarouselContent className="flex items-center justify-center">
            {fileUrls.map((file, index) => (
              <CarouselItem
                key={index}
                className="flex items-center justify-center w-fit"
              >
                <div className="overflow-hidden rounded-xl">
                  <Image
                    key={index}
                    src={file}
                    alt={`preview-${index}`}
                    width={800}
                    height={800}
                    className="object-contain max-h-[70vh]"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-2 left-1/2">
            <CarouselPrevious className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-black" />
            <CarouselNext className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-black" />
          </div>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default MessageImagesDialog;
