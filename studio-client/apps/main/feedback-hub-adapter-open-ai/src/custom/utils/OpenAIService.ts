import { AnyFunction } from "@jangaroo/runtime/types";
import GenericRemoteJob from "@coremedia/studio-client.cap-rest-client-impl/common/impl/GenericRemoteJob";
import jobService from "@coremedia/studio-client.cap-rest-client/common/jobService";
import JobExecutionError from "@coremedia/studio-client.cap-rest-client/common/JobExecutionError";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";

class OpenAIService {

  public static generateImages(prompt: string): Promise<string[]> {
    return new Promise((resolve: AnyFunction, reject: AnyFunction) => {

      const params = {
        prompt: prompt,
        siteId: "all",
        groupId: "OpenAI"
      };

      this.executeJob(
        "OpenAIGenerateImagesJob", params,
        (result) => {
          console.log(result);
          resolve(result.urls);
        }, reject);
    });
  }

  public static createPicturesForUrls(urls: string[], parentFolder: Content): Promise<Content[]> {
    return new Promise((resolve: AnyFunction, reject: AnyFunction) => {

      const params = {
        imageUrls: urls,
        parentFolder: parentFolder
      };

      this.executeJob(
        "OpenAICreatPicturesFromUrlsJob", params,
        (result) => {
          resolve(result)
        }, reject);
    });
  }

  private static executeJob(jobType: string, jobParams: Object, onSuccess: Function, onFailure: Function = null) {
    const job = new GenericRemoteJob(jobType, jobParams);
    jobService._.executeJob(
      job,
      (result: any) => {onSuccess(result);},
      (error: JobExecutionError) => {
        console.error(`Unable to execute job ${jobType}: ${error.message}`);
        onFailure && onFailure(error);
      });
  }

}

export default OpenAIService;
