# Tier List Maker

This project is an [interactive webpage](https://neekthegiraffe.github.io/tier-list-maker/) 
where users can upload images of their choice and rank them into tiers (S, A, B, down to F).

This app was made with [p5.js](https://p5js.org).

## Try the app online

1. Visit the [live webpage](https://neekthegiraffe.github.io/tier-list-maker/)!
2. Upload images using image URLs, or fromm your computer.
3. Rank the images into tiers.
4. Download an image of your tier list!

## Running the app locally

1. Have [VS Code](https://code.visualstudio.com) installed
2. Under Extensions, install the Live Server extension
3. Clone the repository using the command line, and open VS Code:
```
git clone https://github.com/NeekTheGiraffe/tier-list-maker.git
code tier-list-maker
```
4. In the bottom right corner, click "Go Live", which will start a
local server.
5. Navigate to `http://localhost:XXXX` where `XXXX` is the port 
number (it should default to 5500).

## App features

* Dynamically upload using URLs 
* Convenient drag-and-drop interface
* Quickly download the resulting tier list as an image!

## Desktop version

This app is a port from the [desktop version](https://github.com/NeekTheGiraffe/processing-tier-list) 
I made using the Java framework [Processing](https://processing.org).

## Future directions

* More control of the item sizes
* Add/edit custom tiers
* Somehow save images you upload for next time
* Somehow improve resolution of items
* Refactor away from OOP