import { ReactNode, useContext, useEffect, useRef } from "react";
import { Popup } from "@antv/l7";
import { useMount, useUnmount } from "ahooks";
import { MapSceneContext } from "@/models/map";
import { createPortal } from "react-dom";

interface IPopupProps {
  lngLat: number[];
  maxWidth?: number;
  onClose?: () => void;
  children: ReactNode;
}
const L7Popup = ({ lngLat, maxWidth, onClose, children }: IPopupProps) => {
  const mapScence = useContext(MapSceneContext);
  const popupRef = useRef<Popup | null>(null);
  const domRef = useRef(document.createElement("div"));
  useMount(() => {
    if (mapScence && domRef.current) {
      popupRef.current = new Popup({
        lngLat: {
          lng: lngLat[0],
          lat: lngLat[1],
        },
        title: "",
        html: domRef.current,
        maxWidth: maxWidth ? `${maxWidth}px` : "400px",
        stopPropagation: true,
        closeButton: false,
      });
      mapScence.addPopup(popupRef.current);
      initEvent();
    }
  });
  useUnmount(() => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  });

  const initEvent = () => {
    if (popupRef.current) {
      if (onClose) {
        popupRef.current.on("close", onClose);
      }
    }
  };

  useEffect(() => {
    if (lngLat && lngLat.length > 1) {
      if (popupRef.current) {
        popupRef.current.setLngLat({
          lng: lngLat[0],
          lat: lngLat[1],
        });
      }
    }
  }, [lngLat]);

  console.info("============lngLat==============", lngLat);
  return createPortal(children, domRef.current);
};

export default L7Popup;
