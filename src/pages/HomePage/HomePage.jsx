import { Carousel } from "antd";
import React from "react";

function HomePage() {
  const sliderItems = [
    {
      height: "480px",
      backgroundImage:
        'url("https://cdnv2.tgdd.vn/mwg-static/topzone/Banner/fc/4a/fc4a56b06365bb9f42d59c6e05d33def.png")',
      backgroundSize: "cover",
    },
    {
      height: "480px",
      backgroundImage:
        'url("https://cdnv2.tgdd.vn/mwg-static/topzone/Banner/ee/58/ee58ca26322d2881aeca1fe2f35a5d38.png")',
      backgroundSize: "cover",
    },
    {
      height: "480px",
      backgroundImage:
        'url("https://cdnv2.tgdd.vn/mwg-static/topzone/Banner/b7/ef/b7efece2b3824c9eea01e1c20beb2fa7.png")',
      backgroundSize: "cover",
    },
    {
      height: "480px",
      backgroundImage:
        'url("https://cdnv2.tgdd.vn/mwg-static/topzone/Banner/38/d7/38d70a75588cebf5d471e8a0e6fa5fdd.png")',
      backgroundSize: "cover",
    },
    {
      height: "480px",
      backgroundImage:
        'url("https://cdnv2.tgdd.vn/mwg-static/topzone/Banner/e6/72/e6725fa42e6bccd4e0d9ff3ff7c02393.jpg")',
      backgroundSize: "cover",
    },
    {
      height: "480px",
      backgroundImage:
        'url("https://cdnv2.tgdd.vn/mwg-static/topzone/Banner/45/11/4511a88521a2cc486825b713c6ccf141.jpg")',
      backgroundSize: "cover",
    },
  ];

  return (
    <div>
      <Carousel autoplay arrows>
        {sliderItems.map((sliderItem) => {
          return (
            <div key={sliderItem.backgroundImage}>
              <div style={sliderItem}></div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

export default HomePage;
