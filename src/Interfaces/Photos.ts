export interface I_Photo_URL {
  full: string;
  thumb: string;
}
export interface I_Photos {
  aspectRatio: number;
  id: string;
  title: string;
  height: number;
  width: number;
  urls: I_Photo_URL;
}
