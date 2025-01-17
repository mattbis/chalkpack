import {chalk} from "chalk"
import {default as isString} from "is-string"
// todo: (matt): if node then 
// import {boxen} from "boxen"
const emptyObject = {}
// is the generated logger
let _cached = {}
// is the export of logs
let _logs = {}
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
export let DEFAULT_HANDLE_LOG_OPTIONS = {timing: false, prefix: "--> ", preBr: false, postBr: false}
export async function _handleLogBrowser({}) {}
export async function _handleLogServer({}) {}
// TODO: (matt): add buffer option to not use console but an array storage...
// TODO: (matt): can change all vary the main functions for browser or node... since they are called often there is no harm duplicating it... as some stuff is not necesssary...
export async function _handleLog({
  level, msgs, options = DEFAULT_HANDLE_LOG_OPTIONS
}) {
  if (!level) level = "log"
  if (!isString(level)) level.toString()
  const postLog = console[level] // cache local
  if (!msgs) msgs = ""

  // ifBrowser() handle references.. dont mangle
  // first get the type of the messages
  // const messagesType = Object.prototype.toString.call(msgs)

  // its safe to add it here with these types
  if (Array.isArray(msgs) || isString(msgs)) msgs = options.prefix.concat(msgs)
  else {
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
export function chalkpack({options = {timings: false, target: 'console'}}) {
  l.chalk_pack_now = Date.now()
  l.id = 'chalkpack'
  Object.keys(map).forEach((key) => {
    const def = map[key]
    const c = def.c
    const m = chalk[c]
    const proxiedLog = _proxyLogs(options)
    if (def.a) def.a.forEach(a => {l[a] = proxiedLog})
    l[key] = proxiedLog
  })
  return l
}
// use this in DEV mode chains so that you can avoid some insane problems... chalkpack is always going to use l. 
export function safeRegister() {
  if (!canRegister()) {
    console.error('cannot register chalkpack: exiting')
    return
  }
  else 
    register()
}
// clobber
export function register() {
  if (_cached.is(emptyObject)) {_cached = chalkpack()}
  if (!globalThis["l"]) globalThis["l"] = _cached
}
// check if .l is chalkpack
export function isGlobalThisLChalkpack() {
  return globalThis["l"].chalk_pack_now && globalThis["l"].id.includes("chalkpack")
}
export function canRegister() {
  return !globalThis["l"]
}
export default {
  safeRegister, register, chalkpack
}
