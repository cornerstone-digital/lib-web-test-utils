"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pngjs_1 = require("pngjs");
// import * as pixelmatch from 'pixelmatch';
// const PNG = require('pngjs')
const expect = require('expect');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const pixelmatch = require('pixelmatch');
// const devices = require('puppeteer/DeviceDescriptors')
const Helper = require('codeceptjs/lib/helper/Puppeteer');
class PuppeteerHelper extends Helper {
    constructor(config = {}) {
        super(config);
        this.config = config;
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
        };
        this.diffImageToScreenshot = this.diffImageToScreenshot.bind(this);
    }
    /**
     * Hook executed before all tests
    
    _init() {
  
    }
    */
    /**
     * Hook executed before each test.
     
    _before() {
  
    }
    */
    /**
     * Hook executed after each test
     
    _after() {
  
    }
    */
    /**
     * Hook provides a test details
     * Executed in the very beginning of a test
     *
     * @param {*} test
     */
    _test(test) {
        super._test(test);
        this.currentTest = test;
        // if (process.env.DEBUG) {
        //   console.log(test)
        // }
    }
    /**
     * Hook executed after each passed test
     *
     * @param {*} test
    
    _passed(test: any) {
      super._passed(test)
      if (process.env.DEBUG) console.log(test)
    }
     */
    /**
     * Hook executed after each export failed test
     *
     * @param {*} test
     
    _failed(test: any) {
      super._failed(test)
      if (process.env.DEBUG) console.log(test)
    }
    */
    /**
     * Hook executed before each step
     *
     * @param {*} step
     * @override
     
    
    _beforeStep(step: any) {
      super._beforeStep(step)
      if (process.env.DEBUG) {
        console.log('Step', step)
      }
    }
    */
    /**
     * Hook executed after each step
     *
     * @param {*} step
     * @override
     
     
    _afterStep(step: any) {
      super._afterStep(step)
    }
    */
    /**
     * Hook executed before each suite
     *
     * @param {*} suite
     */
    _beforeSuite(suite) {
        super._beforeSuite(suite);
        // if (process.env.DEBUG) {
        //   console.log('Suite', suite)
        // }
    }
    /**
     * Hook executed after each suite
     *
     * @param {*} suite
     */
    _afterSuite(suite) {
        super._afterSuite(suite);
        console.log(this.SnapshotState);
    }
    /**
     * Hook executed after all tests are executed
     *
     * @param {*} suite
     
    _finishTest(suite: any) {
      super._finishTest(suite)
      if (process.env.DEBUG) console.log(suite)
    }
    */
    diffImageToScreenshot(screenshot, fileName) {
        let result;
        const currentTest = this.currentTest;
        const folderName = currentTest.title
            .toLowerCase()
            .split(' ')
            .join('-');
        const filePathArr = currentTest.file.split('/');
        filePathArr.pop();
        const snapshotPath = path.join(filePathArr.join('/'), this.config.snapshotsDir);
        const folderPath = path.join(snapshotPath, folderName);
        const baselineSnapshotPath = path.join(folderPath, `${fileName}-snap.png`);
        const failureThresholdType = 'pixel';
        const failureThreshold = 0.1;
        const fillSizeDifference = (width, height) => (image) => {
            const inArea = (x, y) => y > height || x > width;
            for (let y = 0; y < image.height; y++) {
                for (let x = 0; x < image.width; x++) {
                    if (inArea(x, y)) {
                        const idx = (image.width * y + x) << 2;
                        image.data[idx] = 0;
                        image.data[idx + 1] = 0;
                        image.data[idx + 2] = 0;
                        image.data[idx + 3] = 64;
                    }
                }
            }
            return image;
        };
        const createImageResizer = (width, height) => (source) => {
            const resized = new pngjs_1.PNG({ width, height, fill: true });
            pngjs_1.PNG.bitblt(source, resized, 0, 0, source.width, source.height, 0, 0);
            return resized;
        };
        const alignImagesToSameSize = (firstImage, secondImage) => {
            // Keep original sizes to fill extended area later
            const firstImageWidth = firstImage.width;
            const firstImageHeight = firstImage.height;
            const secondImageWidth = secondImage.width;
            const secondImageHeight = secondImage.height;
            // Calculate biggest common values
            const resizeToSameSize = createImageResizer(Math.max(firstImageWidth, secondImageWidth), Math.max(firstImageHeight, secondImageHeight));
            // Resize both images
            const resizedFirst = resizeToSameSize(firstImage);
            const resizedSecond = resizeToSameSize(secondImage);
            // Fill resized area with black transparent pixels
            return [
                fillSizeDifference(firstImageWidth, firstImageHeight)(resizedFirst),
                fillSizeDifference(secondImageWidth, secondImageHeight)(resizedSecond)
            ];
        };
        const outputDir = path.join(folderPath, '__diff_output__');
        const diffOutputPath = path.join(outputDir, `${fileName}-diff.png`);
        if (fs.existsSync(baselineSnapshotPath) && !process.env.UPDATE_SNAPSHOTS) {
            rimraf.sync(diffOutputPath);
            const defaultDiffConfig = {
            // threshold: failureThreshold
            };
            const customDiffConfig = {};
            const diffConfig = Object.assign({}, defaultDiffConfig, customDiffConfig);
            const rawReceivedImage = pngjs_1.PNG.sync.read(screenshot);
            const rawBaselineImage = pngjs_1.PNG.sync.read(fs.readFileSync(baselineSnapshotPath));
            const hasSizeMismatch = rawReceivedImage.height !== rawBaselineImage.height ||
                rawReceivedImage.width !== rawBaselineImage.width;
            // Align images in size if different
            const [receivedImage, baselineImage] = hasSizeMismatch
                ? alignImagesToSameSize(rawReceivedImage, rawBaselineImage)
                : [rawReceivedImage, rawBaselineImage];
            const imageWidth = receivedImage.width;
            const imageHeight = receivedImage.height;
            const diffImage = new pngjs_1.PNG({ width: imageWidth, height: imageHeight });
            const diffPixelCount = pixelmatch(receivedImage.data, baselineImage.data, diffImage.data, imageWidth, imageHeight, diffConfig);
            const totalPixels = imageWidth * imageHeight;
            const diffRatio = diffPixelCount / totalPixels;
            let pass = false;
            if (failureThresholdType === 'pixel') {
                pass = diffPixelCount <= failureThreshold;
            }
            else if (failureThresholdType === 'percent') {
                pass = diffRatio <= failureThreshold;
            }
            else {
                throw new Error(`Unknown failureThresholdType: ${failureThresholdType}. Valid options are "pixel" or "percent".`);
            }
            if (!pass) {
                mkdirp.sync(outputDir);
                const compositeResultImage = new pngjs_1.PNG({
                    width: imageWidth * 3,
                    height: imageHeight
                });
                // copy baseline, diff, and received images into composite result image
                pngjs_1.PNG.bitblt(baselineImage, compositeResultImage, 0, 0, imageWidth, imageHeight, 0, 0);
                pngjs_1.PNG.bitblt(diffImage, compositeResultImage, 0, 0, imageWidth, imageHeight, imageWidth, 0);
                pngjs_1.PNG.bitblt(receivedImage, compositeResultImage, 0, 0, imageWidth, imageHeight, imageWidth * 2, 0);
                // console.log('compositeResultImage', compositeResultImage)
                // const options = { colorType: 6 }
                // const buffer = PNG.sync.write(diffImage, options)
                const writeStream = fs.createWriteStream(diffOutputPath);
                compositeResultImage.pack().pipe(writeStream);
                writeStream.on('error', (error) => {
                    console.log(error);
                });
                // const pngWriteStream = fs.createWriteStream(diffOutputPath)
                // fs.writeFileSync(diffOutputPath, buffer)
            }
            result = {
                pass,
                diffOutputPath,
                diffRatio,
                diffPixelCount
            };
        }
        else {
            mkdirp.sync(folderPath);
            rimraf.sync(diffOutputPath);
            fs.writeFileSync(baselineSnapshotPath, screenshot);
            result = process.env.UPDATE_SNAPSHOTS
                ? { pass: true, updated: true }
                : { pass: true, added: true };
            if (result.added) {
                this.SnapshotState.added++;
            }
            if (result.updated) {
                this.SnapshotState.updated++;
            }
        }
        return result;
    }
    expectScreenshotToMatch(viewport, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.setViewport(viewport);
            const clientHeight = yield this.page.evaluate(() => {
                return document.querySelector('.vfuk-SectionRenderer__section-outer-wrapper').scrollHeight;
            });
            this.page.setViewport({
                width: viewport.width,
                height: clientHeight
            });
            const screenshot = yield this.page.screenshot({ fullPage: true });
            const result = this.diffImageToScreenshot(screenshot, fileName);
            return expect(result.pass).toBeTruthy();
            // const currentPage = this.page;
            // console.log(currentPage)
            // return Promise.all(
            //   this.config.devicesToEmulate.map(async (device: any) => {
            //     const currentDevice = devices[device]
            //     if (currentDevice) {
            //       await this.page.setViewport(currentDevice.viewport)
            //       const clientHeight = await this.page.evaluate( () => {
            //         return document.querySelector('.vfuk-SectionRenderer__section-outer-wrapper')!.clientHeight
            //       })
            //       console.log('clientHeight', clientHeight)
            //       await this.page.setViewport({
            //         width: currentDevice.viewport.width,
            //         height: clientHeight
            //       })
            //       // await this.page.reload()
            //       const fileName: string = `/${currentDevice.name}`
            //       const screenshot: Buffer = await this.page.screenshot({ fullPage: true })
            //       const result = this.diffImageToScreenshot(screenshot, fileName)
            //       return expect(result.pass).toBeTruthy()
            //     } else {
            //       return true
            //     }
            //   })
            // )
        });
    }
}
module.exports = PuppeteerHelper;
//# sourceMappingURL=PuppeteerHelper.js.map