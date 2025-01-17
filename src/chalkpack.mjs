import { chalk } from "chalk"
import {boxen} from "boxen"
import {default as isString} from "is-string"
const emptyObject = {}
const _cached = {}
export const map = {
  error: {c:"red",a:["e"]},
  info: {c:"white",a:["i"]},
  head: {c:"cyan",a:["h"]},
  warn: {c:"yellow",a:["w"]},
  yes: {c:"green",a:["y"]},
  no: {c:"gray",a:["n"]}
}
export let l = {
  br: () => {console.log("")}
}
// TODO: (matt): add buffer option to not use console but an array storage...
export async function _handleLog({
  level, msgs, options = {timing: false, prefix: "--> ", preBr: false, postBr: false}
}) {
  const postLog = console[level] // cache local
  if (!level) level = "log"
  if (!isString(level)) level.toString()
  if (!msgs) msgs = ""
  // first get the type of the messages
  const messagesType = Object.prototype.toString.call(msgs)

  // its safe to add it here with these types
  if (Array.isArray(msgs) || isString(msgs)) msgs = options.prefix.concat(msgs)
  else {
    //if we change it the browser will not be able to parse the log data
    //msgs = options.prefix.concat(msgs.toString())
  }
  if (options.timing) Date.now().concat(msgs)
  if (options.preBr) postLog("")
  switch (level) {
    case "warn":
    case "error":
      postLog(boxen(msgs, {title: level.toUpperCase(), titleAlignment: 'center'}))
      break;
    default:
      postLog(msgs)
      break;
  }
  if(options.postBr) postLog("")
  return Promise.resolve()
}
export function _proxyLogs(options) {
  return async (...args) => {
    await _handleLog({
      ...options, level, msgs:args
    })
  }
}
export function chalkpack({options = {timings: false}}) {
  Object.keys(map).forEach((key) => {
    const def = map[key]
    const c = def.c
    const m = chalk[c]
    if (def.a) def.a.forEach(a => {l[a] = _proxyLogs(options)})
    l[key] = _proxyLogs(options)
  });
  return l;
}
export function register() {
  if (_cached.is(emptyObject)) {_cached = chalkpack()}
  if (!globalThis["l"]) globalThis["l"] = _cached
}
export default {
  register, chalkpack
}
