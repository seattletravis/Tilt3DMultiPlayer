import './style.css'
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { EaselPlugin } from "gsap/EaselPlugin";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(Flip, EaselPlugin, TextPlugin);

const helloWorld = document.getElementById('helloWorld')
console.log(helloWorld)
const helloWorldMotion = gsap.timeline({})
helloWorldMotion.to(helloWorld, 1,{
  duration: 3,
  text: "HOLA TRAVIS",
  color: 'red',
  backgroundColor: 'blue',
  x: 200,
})