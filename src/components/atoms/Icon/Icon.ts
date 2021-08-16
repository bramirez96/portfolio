import * as icons from '../../../assets/icons';
import { IconProps, Icons } from './Icon.model';

export default function Icon__constructor(name: Icons, props?: IconProps) {
  const img = new Image();
  img.src = icons[name];
  img.alt = props?.alt;
  const imgWithProps = Object.assign(img, props || {});
  return imgWithProps;
}
