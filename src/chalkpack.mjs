// TODO: I think I want zero deps... so I will just copy and condense how these projects work... ( including some kinda license ). The deps will remain in pkg json

// #region 3p
import chalk from "chalk"
import boxen from "boxen"
import {default as isString} from "is-string"
// #endregion 3p


// TODO: I am thinking perhaps we have a script that uses code mod on the above, so i dont need to manually merge it!!!

// #region config
const emptyObject = {}

export const map = {
  fatal: {c:"red", a:["f"]},
  error: {c:"red", a:["e"]},
  info: {c:"white", a:["i"]},
  head: {c:"cyan", a:["h"]},
  warn: {c:"yellow", a:["w"]},
  yes: {c:"green", a:["y"]},
  no: {c:"gray", a:["n"]},
  // used for a series of key pairs, with auto .br()
  k: {c:"green", a:['k']},
  v: {c:"blue", a:['v']}
}
// #endregion config

let _cached = {}

// 1: make it work just node for now
// 2: then do the other stuff... plenty of much better loggers exist.. the only real reason for this is just its tiny / apps / cli / runtime elec && the main reason is I just want something very simple.. l.br() l.i() l.head() that is it .. nothing but a simple palette... to many Ts/Js packages and apps are huge...

// TODO: .kv(['1a','1b','2a','2b']) formatted
// TODO: detect the host as browser / not a browser
// TODO: prototype pollutions
// TODO: c,a,r to change what happens
// TODO: whether atomic structures or shared things are a good idea.. probably not
// TODO: the check for existence is not particularly good...
// TODO: async - maybe worker or cluster saveLogs ( no blocks ) but this is exit.. so we prob don't need to worry.. however, if you had some kinda debug option.. this might be useful to not block the entire thing.... 
// TODO: iso save -> fs.write || [browser] storage... ( this is not a bad idea for some web apps/ apps  - particularly when building something that requires a lot of logging


//   __runTimeConsoleRef = console
//function putLog() {}
//function pushLogs() {}

export let l = {
  // TODO if its 'a' then this needs to change
  br: () => {console.log("")}
  // ==> br: () => {putLog()}
}

export const DEFAULT_HANDLE_LOG_OPTIONS = {
  timing: false,
  prefix: "--> ", // ==> --> [thing]
  preBr: false, postBr: false
}

// the console is used its not persisted
export const DEFAULT_TARGET_OPTION = {target: 'console'}

// the logs go to arrays... you have to save them
export const DEFAULT_TARGET_ARRAY = {target: 'array' }

// the logs go to a map of sets? // hmmm


// TODO: the logs are coded into a binary array

// the logs roll onto disk ( really not recommended )
export const DEFAULT_TARGET_ROLLING_BUFFER = {target: 'rolling'}

// a buffer of the most recent logs - set by some age
export const DEFAULT_TARGET_CIRCULAR_BUFFER = {target: 'circular'}

export const DEFAULT_CHUNK_WRITES = {chunk_writes: !0}

// TODO: then you can subscribe to the circular option, or the array to set everything
export async function _handleLogBrowser({}) {
  const postLog = console[level] // cache local
}
export async function _handleLogServer({}) {}

export async function _handleLog({
  level,
  msgs,
  options = DEFAULT_HANDLE_LOG_OPTIONS
}) {
  if (!level) level = "log"
  if (!isString(level)) level.toString()
  if (level === "h" || level === "head") {
    if (!options.preBr) options.preBr = true
    if (!options.postBr) options.postBr = true
  }
  if (!msgs) msgs = "[log]"

  // when it node we can manipulate the formatting better, hence handleLogBrowser
  // however what I ideally need to do is make a giant function that does the entire thing for each runtime type...

  // TODO: use mad cache technique from fastify ..

  // first get the type of the messages
  //const messagesType = Object.prototype.toString.call(msgs)

  if (Array.isArray(msgs) || isString(msgs)) {
    msgs = options.prefix.concat(msgs)
  }
  else {
    //if we change it the browser will not be able to parse the log data
    //msgs = options.prefix.concat(msgs.toString())
  }
  if (options.timing) Date.now().concat(msgs)
  if (options.preBr) postLog("")
  switch (level) {
    case "warn":
    case "error":
      // TODO: (matt): when its error handle the error object
      postLog(boxen(msgs, {title: level.toUpperCase(), titleAlignment: 'center'}))
      break;
    default:
      postLog(msgs)
      break;
  }
  if(options.postBr) postLog("")
  return Promise.resolve()
}
export function __each_k_v(keyValCollection) {
  let i = keyValCollection.length-1
  do {
    let k = keyValCollection[i]
    let v = keyValCollection[i-1]
    // Colour the key and the value
    chalk.yellow()
    chalk.blue()
  } 
  while(i-2)
}
export function __chalkpack_browser({options = {timings: !1}}) {
}
export function __chalkpack_server({options = {timings: false}}) {
  Object.keys(map).forEach((key) => {
    const def = map[key]
    const c = def.c
    const m = chalk[c]
    if (def.a) def.a.forEach(a => {l[a] = async (...args) => {
      await _handleLog(options)
    }})
    l[key] = async (...args) => {
      await _handleLog(options)
    }
  });
  return l;
}
export function persist_logs() {}
export function is_registered() {
  return globalThis["l"].chalk_pack_now && 
    globalThis["l"].id.includes("chalkpack")
}

export function can_register() {
  return !globalThis["l"] && !isRegistered()
}

// use this in DEV mode chains so that you can avoid some insane problems... chalkpack is always going to use l.
// I'm marking this underscore, in that its unlikely to be used much and is more debug the tool chain
export function _safe_register_chalkpack() {
  if (!can_register()) {
    console.error('cannot register chalkpack: exiting')
    return
  }
  else
    register()
}

export default function register_chalkpack() {

  // determine the runtime host... 

  // register using the tailored function

  //if (_cached.is(emptyObject)) {_cached = chalkpack()}
  //if (!globalThis["l"]) globalThis["l"] = _cached
}

