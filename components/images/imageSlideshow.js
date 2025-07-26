"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import classes from "./image-slideshow.module.css";
import { images } from "./images.js";

export default function ImageSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // react hooks that are not available on the server side components so it need to be on the client side comeponent.
  // As the next js is a server side rendering framework, we need to use the useEffect hook to set the interval for changing the images on the client side.
  // directive need to be added on the top of the file to make it a client side component.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.slideshow}>
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.image}
          className={index === currentImageIndex ? classes.active : ""}
          alt={image.alt}
        />
      ))}
    </div>
  );
}
