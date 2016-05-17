declare module "ar-drone" {

  function createClient(): any
  function createClient(options): any
  function createUdpControl(options)
  function createPngStream(options)
  function createUdpNavdataStream(options)
}
