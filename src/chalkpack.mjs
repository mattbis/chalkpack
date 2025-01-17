import {chalk} from "chalk"
import {default as isString} from "is-string"
// todo: the module will have to be set a mode before.init()
// get a reference to the current console....
// let __runTimeConsoleRef
// function init() {
//   __runTimeConsoleRef = console
// }
// function setup() {
// }
// todo: (matt): if node then 
// import {boxen} from "boxen"
const emptyObject = {}
// is the generated logger
let _cached = {}
// is the export of logs as collection of arrays - memory growth....
let _logs = {
  // ==> .info
  // ==> .warn
}
export const map = {
  error: {c:"red",a:["e"]},
  info: {c:"white",a:["i"]},
  head: {c:"cyan",a:["h"]},
  warn: {c:"yellow",a:["w"]},
  yes: {c:"green",a:["y"]},
  no: {c:"gray",a:["n"]}
}
function putLog() {}
function pushLogs() {}
// if we have rollign or array we can never directly address console... 
export let l = {
  br: () => {console.log("")}
  // ==> br: () => {putLog()}
}
export let DEFAULT_HANDLE_LOG_OPTIONS = {timings: false, prefix: "--> ", preBr: false, postBr: false}
export let DEFAULT_TARGET_OPTION = {target: 'console'}
export let DEFAULT_TARGET_ARRAY = {target: 'array' }
export let DEFAULT_TARGET_ROLLING_BUFFER = {target: 'rolling'}
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
  if (options.timings) Date.now().concat(msgs)
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
export function isRegistered() {
  return globalThis["l"].chalk_pack_now && globalThis["l"].id.includes("chalkpack")
}
export function canRegister() {
  return !globalThis["l"]
}
// TODO: (matt): how this should work next... so the module is completed... 
// set the type of logger dynamically from: as modifier c a r , each can be used the same time.... 
// 'console' ==> std out memory , // default optional since it will slow down application
// 'array' ==> node js memory for live application // the log is recorded into memory this will be faster
// todo: below is hmmmmm
// 'rolling' ==> disk buffered write chunks // the logs which might be array or not , as used as a rolling buffer, that is async ... writes are delayed....
export default {
  safeRegister, register, isRegistered, chalkpack
}
