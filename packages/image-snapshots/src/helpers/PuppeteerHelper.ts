import { PNG } from 'pngjs'
import { WriteStream, existsSync, readFileSync, writeFileSync, createWriteStream } from 'fs'
import pixelmatch = require('pixelmatch')
import * as expect from 'expect'
import * as rimraf from 'rimraf'
import * as mkdirp from 'mkdirp'
import * as path from 'path'
import * as Helper from 'codeceptjs/lib/helper/Puppeteer'
import { Page, Browser } from 'puppeteer'

class PuppeteerHelper extends Helper {
  page: Page
  browser: Browser
  config: ISnapshotConfig
  currentTest: ICodeceptTest
  SnapshotState: ISnapshotState

  constructor (config: any = {}) {
    super(config)
    this.config = config
    this.SnapshotState = {
      counters: new Map(),
      dirty: false,
      added: 0,
      updated: 0,
      matched: 0,
      unmatched: 0,
      deleted: 0,
      total: 0,
      updateSnapshots: config.updateSnapshots,
      snapshotData: new Map()
    }

    this.diffImageToScreenshot = this.diffImageToScreenshot.bind(this)
  }

  /**
   * Hook provides a test details
   * Executed in the very beginning of a test
   *
   * @param {*} test
   */
  _test (test: ICodeceptTest) {
    super._test(test)
    this.currentTest = test
  }

  /**
   * Hook executed after each passed test
   *
   * @param {*} test
   */

  _passed (test: ICodeceptTest) {
    super._passed(test)
  }

  /**
   * Hook executed after each export failed test
   *
   * @param {*} test
   */

  _failed (test: ICodeceptTest) {
    super._failed(test)
  }

  /**
   * Hook executed before each suite
   *
   * @param {*} suite
   */

  _beforeSuite (suite: any) {
    super._beforeSuite(suite)
  }

  /**
   * Hook executed after each suite
   *
   * @param {*} suite
   */

  _afterSuite (suite: any) {
    super._afterSuite(suite)
  }

  /**
   * Hook executed after all tests are executed
   *
   * @param {*} suite
   */

  _finishTest (suite: any) {
    super._finishTest(suite)
  }

  diffImageToScreenshot (screenshot: Buffer, fileName: string) {
    let result: ISnapshotResult
    const currentTest = this.currentTest
    const folderName: string = currentTest.title
      .toLowerCase()
      .split(' ')
      .join('-')
    const filePathArr: string[] = currentTest.file.split('/')
    filePathArr.pop()
    const snapshotPath: string = path.join(
      filePathArr.join('/'),
      this.config.snapshotsDir
    )
    const folderPath: string = path.join(snapshotPath, folderName)
    const baselineSnapshotPath: string = path.join(folderPath, `${fileName}-snap.png`)
    const failureThresholdType: string = 'pixel'
    const failureThreshold: number = 0.1

    const fillSizeDifference: Function = (width: number, height: number) => (
      image: PNG
    ) => {
      const inArea = (x: number, y: number) => y > height || x > width
      for (let y: number = 0; y < image.height; y++) {
        for (let x: number = 0; x < image.width; x++) {
          if (inArea(x, y)) {
            const idx: number = (image.width * y + x) << 2
            image.data[idx] = 0
            image.data[idx + 1] = 0
            image.data[idx + 2] = 0
            image.data[idx + 3] = 64
          }
        }
      }
      return image
    }

    const createImageResizer: Function = (width: number, height: number) => (
      source: PNG
    ) => {
      const resized = new PNG({ width, height, fill: true })
      PNG.bitblt(source, resized, 0, 0, source.width, source.height, 0, 0)
      return resized
    }

    const alignImagesToSameSize: Function = (firstImage: PNG, secondImage: PNG) => {
      // Keep original sizes to fill extended area later
      const firstImageWidth: number = firstImage.width
      const firstImageHeight: number = firstImage.height
      const secondImageWidth: number = secondImage.width
      const secondImageHeight: number = secondImage.height
      // Calculate biggest common values
      const resizeToSameSize = createImageResizer(
        Math.max(firstImageWidth, secondImageWidth),
        Math.max(firstImageHeight, secondImageHeight)
      )
      // Resize both images
      const resizedFirst: PNG = resizeToSameSize(firstImage)
      const resizedSecond: PNG = resizeToSameSize(secondImage)
      // Fill resized area with black transparent pixels
      return [
        fillSizeDifference(firstImageWidth, firstImageHeight)(resizedFirst),
        fillSizeDifference(secondImageWidth, secondImageHeight)(resizedSecond)
      ]
    }

    const outputDir: string = path.join(folderPath, '__diff_output__')
    const diffOutputPath: string = path.join(outputDir, `${fileName}-diff.png`)

    if (existsSync(baselineSnapshotPath) && !process.env.UPDATE_SNAPSHOTS) {
      rimraf.sync(diffOutputPath)

      const defaultDiffConfig: object = {
        // threshold: failureThreshold
      }

      const customDiffConfig: object = {}

      const diffConfig: object = Object.assign({}, defaultDiffConfig, customDiffConfig)
      const rawReceivedImage: PNG = PNG.sync.read(screenshot)
      const rawBaselineImage: PNG = PNG.sync.read(
        readFileSync(baselineSnapshotPath)
      )

      const hasSizeMismatch: boolean =
        rawReceivedImage.height !== rawBaselineImage.height ||
        rawReceivedImage.width !== rawBaselineImage.width

      // Align images in size if different
      const [receivedImage, baselineImage] = hasSizeMismatch
        ? alignImagesToSameSize(rawReceivedImage, rawBaselineImage)
        : [rawReceivedImage, rawBaselineImage]

      const imageWidth: number = receivedImage.width
      const imageHeight: number = receivedImage.height
      const diffImage: PNG = new PNG({ width: imageWidth, height: imageHeight })
      const diffPixelCount: number = pixelmatch(
        receivedImage.data,
        baselineImage.data,
        diffImage.data,
        imageWidth,
        imageHeight,
        diffConfig
      )

      const totalPixels: number = imageWidth * imageHeight
      const diffRatio: number = diffPixelCount / totalPixels

      let pass: boolean = false

      if (failureThresholdType === 'pixel') {
        pass = diffPixelCount <= failureThreshold
      } else if (failureThresholdType === 'percent') {
        pass = diffRatio <= failureThreshold
      } else {
        throw new Error(
          `Unknown failureThresholdType: ${failureThresholdType}. Valid options are "pixel" or "percent".`
        )
      }

      if (!pass) {
        mkdirp.sync(outputDir)
        const compositeResultImage = new PNG({
          width: imageWidth * 3,
          height: imageHeight
        })

        // copy baseline, diff, and received images into composite result image
        PNG.bitblt(baselineImage, compositeResultImage, 0, 0, imageWidth, imageHeight, 0, 0)
        PNG.bitblt(diffImage, compositeResultImage, 0, 0, imageWidth, imageHeight, imageWidth, 0)
        PNG.bitblt(receivedImage, compositeResultImage, 0, 0, imageWidth, imageHeight, imageWidth * 2, 0)

        const writeStream: WriteStream = createWriteStream(diffOutputPath)
        compositeResultImage.pack().pipe(writeStream)

        writeStream.on('error', (error: any) => {
          console.log(error)
        })
      }

      result = {
        pass,
        diffOutputPath,
        diffRatio,
        diffPixelCount
      }
    } else {
      mkdirp.sync(folderPath)
      rimraf.sync(diffOutputPath)
      writeFileSync(baselineSnapshotPath, screenshot)

      result = process.env.UPDATE_SNAPSHOTS
        ? { pass: true, updated: true }
        : { pass: true, added: true }

      if (result.added) {
        this.SnapshotState.added++
      }

      if (result.updated) {
        this.SnapshotState.updated++
      }
    }

    return result
  }

  async expectScreenshotToMatch (viewport: any, fileName: string) {
    await this.page.setViewport(viewport)

    const clientHeight: number = await this.page.evaluate(() => {
      return document.querySelector(
        '.vfuk-SectionRenderer__section-outer-wrapper'
      ).scrollHeight
    })

    this.page.setViewport({
      width: viewport.width,
      height: clientHeight
    })

    const screenshot: Buffer = await this.page.screenshot({ fullPage: true })
    const result = this.diffImageToScreenshot(screenshot, fileName)

    return expect(result.pass).toBeTruthy()
  }
}

module.exports = PuppeteerHelper
