import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";

import { standardDeviation } from "../../utils/stats";

import { DATA_PROP as defaultDataProp } from "../../constants";

/**
 * @method addSignalQuality
 * Adds a signal quality property to a stream of Epochs
 * signal quality is represented as standard deviation value for each channel
 * @example eeg$.pipe(addSignalQuality())
 * @param {Object} options - addSignalQuality options
 * @param {string} [options.dataProp='data] Name of key associated with eeg data
 * @returns {Observable<Epoch>}
 */
export const addSignalQuality = ({
  dataProp = defaultDataProp
} = {}) => source =>
  createPipe(
    source,
    map(epoch => {
      const names = epoch.info.channelNames
        ? epoch.info.channelNames
        : epoch[dataProp].map((_, i) => i);
      return {
        ...epoch,
        signalQuality: epoch[dataProp].reduce((acc, curr, index) => {
          acc[names[index]] = standardDeviation(curr);
          return acc;
        }, {})
      };
    })
  );
