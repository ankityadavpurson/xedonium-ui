import React, { useState } from 'react'
import * as Xedonium from 'xedonium'

// Everything exported by the library is available in ```jsx live blocks
const ReactLiveScope = { React, useState, ...React, ...Xedonium }

export default ReactLiveScope
