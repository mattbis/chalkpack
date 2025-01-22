import chalk from "chalk"
import boxen from "boxen"
import {default as isString} from "is-string"

const emptyObject = {}

export const map = {
  fatal: {c:"red", a:["f"]},
  error: {c:"red", a:["e"]},
  info: {c:"white", a:["i"]},
  head: {c:"cyan", a:["h"]},
  warn: {c:"yellow", a:["w"]},
  yes: {c:"green", a:["y"]},
  no: {c:"gray", a:["n"]}
}

let _cached = {}

// 1: make it work just node for now
// 2: then do the other stuff... plenty of much better loggers exist.. the only real reason for this is just its tiny / apps / cli / runtime elec && the main reason is I just want something very simple.. l.br() l.i() l.head() that is it .. nothing but a simple palette... to many Ts/Js packages and apps are huge...

// TODO: detect the host as browser / not a browser
// TODO: prototype pollutions
// TODO: c,a,r to change what happens
// TODO: whether atomic structures or shared things are a good idea.. probably not
// TODO: the check for existence is not particularly good...
// TODO: async - maybe worker or cluster saveLogs ( no blocks ) but this is exit.. so we prob don't need to worry.. however, if you had some kinda debug option.. this might be useful to not block the entire thing.... 

//   __runTimeConsoleRef = console
//function putLog() {}
//function pushLogs() {}

export let l = {
  // TODO if its 'a' then this needs to change
  br: () => {console.log("")}
  // ==> br: () => {putLog()}
}

// allow it to be let... which isn't a great idea, but if the code is protected
// and the app is local... id rather its easy to change...
export let DEFAULT_HANDLE_LOG_OPTIONS = {
  timing: false,
  prefix: "--> ", // ==> --> [thing]
  preBr: false, postBr: false
}

// the console is used its not persisted
export let DEFAULT_TARGET_OPTION = {target: 'console'}
// the logs go to arrays... you have to save them
export let DEFAULT_TARGET_ARRAY = {target: 'array' }
export let DEFAULT_TARGET_ROLLING_BUFFER = {target: 'rolling'}
export let DEFAULT_TARGET_CIRCULAR_BUFFER = {target: 'circular'}

export async function _handleLogBrowser({}) {}
export async function _handleLogServer({}) {}

// TODO: (matt): add buffer option to not use console but an array storage...
export async function _handleLog({
  level,
  msgs,
  options = DEFAULT_HANDLE_LOG_OPTIONS
}) {
  const postLog = console[level] // cache local
  if (!level) level = "log"
  if (!isString(level)) level.toString()
  if (level === "h" || level === "head") {
    if (!options.preBr) options.preBr = true
    if (!options.postBr) options.postBr = true
  }
  if (!msgs) msgs = "[log]"

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
      postLog(boxen(msgs, {title: level.toUpperCase(), titleAlignment: 'center'}))
      break;
    default:
      postLog(msgs)
      break;
  }
  if(options.postBr) postLog("")
  return Promise.resolve()
}

// TODO: this isn't really a great idea, performance wise...
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
export function _persistLogs() {}
export function isRegistered() {
  return globalThis["l"].chalk_pack_now && globalThis["l"].id.includes("chalkpack")
}

export function canRegister() {
  return !globalThis["l"] && !isRegistered()
}

// use this in DEV mode chains so that you can avoid some insane problems... chalkpack is always going to use l.
// I'm marking this underscore, in that its unlikely to be used much and is more debug the tool chain
export function _safeRegisterChalkpack() {
  if (!canRegister()) {
    console.error('cannot register chalkpack: exiting')
    return
  }
  else
    register()
}

export default function registerChalkpack() {
  if (_cached.is(emptyObject)) {_cached = chalkpack()}
  if (!globalThis["l"]) globalThis["l"] = _cached
}
