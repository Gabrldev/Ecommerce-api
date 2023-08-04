"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => {
          return (
            <div
              key={url}
              className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
            >
              <div className="absolute z-10 top-2 right-2">
                <Button
                  type="button"
                  onClick={() => onRemove(url)}
                  variant="destructive"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <Image
                fill
                src={url}
                alt="billboard"
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="qwbzhbsf">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button 
              type="button" 
              disabled={disabled} 
              onClick={onClick}
              variant='ghost'
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
