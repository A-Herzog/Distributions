/*
Copyright 2023 Alexander Herzog

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export {format};

/**
 * Javascript variant of the usual format / printf function.
 * @param {String} str String in which {0}, {1} etc. are to be replaced
 * @param  {...String} args Replace values for the placeholders
 * @returns String with values inserted at the placeholder positions
 */
function format(str, ...args) {
  return str.replace(/{(\d+)}/g,(match,number)=>(typeof(args[number])!='undefined')?args[number]:match);
};
