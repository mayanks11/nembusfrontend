/**
 * Adapter Services Architectures
 * Nembus Landing Page
 * Nimalya Saha
 */

import { NotificationManager } from "react-notifications";
import NembusProjectService from "../api/NembusProject";

export default class NembusProjectAdapter {
   static async createProjectAdapter(data) {
    try {
        const projectData = {
            id: "",
            title: data.title,
            description: data.description,
            userId: data.userId,
            createdBy: data.createdBy,
            companyName: data.companyName,
            sheetNo: 0,
            createdOn: new Date()
        }
        const result = await NembusProjectService.createProject(projectData);
        if(result === true) {
          NotificationManager.success("Project Uploaded Sucessfully.");
          return true;
        } else {
          NotificationManager.error("Project Uploading Unsuccessful.");
          return false;
        }
    } catch(error) {
        return false;
    }     
  }

  static async getAllSatelliteInformationAdapter() {
    try {
      const data = await NembusProjectService.getAllSatelliteInformation();
      return data;
    } catch(error) {
      console.log(error);
    }
  }

   static async getAllProjectsAdapter(userId){
    try {
      const data = await NembusProjectService.getAllProjects(userId);
      return {
        projects: data.projects
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async checkCurrentUserProjectAdapter(projectId) {
    try {
      const user = await NembusProjectService.getCurrentUser();
      const project = await NembusProjectService.getProjectData(projectId);
      
      if(project === undefined) {
        NotificationManager.error("Project not found.");
        return false;
      }
      if(user !== false && project !== false) {
        if(project.userId === user.uid) {
          return true;
        } else {
          NotificationManager.error("Project not found.");
          return false;
        }
      }
    } catch(error) {
      console.log(error);
    }
  }

  static async getProjectDataAdapter(projectId) {
    try {
      const data = await NembusProjectService.getProjectData(projectId);
      return data
    } catch(error) {
      console.log(error);
    }
  }

   static async deleteProjectAdapter(projectId) {
    try {
        const user = await NembusProjectService.getCurrentUser();
        const projectData = await NembusProjectService.getProjectData(projectId);

        if(user !== false && projectData !== false) {
          if(projectData.userId === user.uid) {
            const deleteResult = await NembusProjectService.deleteProject(projectId);
            if(deleteResult === false) {
              NotificationManager.error("Couldnot delete project.");
            } else {
              NotificationManager.success("Project deleted successfully.")
            }
          } else {
              NotificationManager.error("Invalid user. Only project owners can delete");
          }
        }
        return true;
    } catch(error) {
        NotificationManager.error("Couldnot delete project.");
        return false;
    }
    
  }

  static async getAnalysisFormMetaDataAdapter(){
    try {
      const data = await NembusProjectService.getAnalysisFormMetaData();
      return {
        data: data.data
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async getCountryListAdapter() {
    try {
      const data = await NembusProjectService.getCountryList();
      return {
        data: data.data
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async getCountrylevel1StateListAdapter(country) {
    try {
      const data = await NembusProjectService.getCountrylevel1StateList(country);
      return {
        data: data.data
      }
    } catch(error) {
      console.log(error);
    }
  }

  static async getGeoJsonCoordinatesInterestedLocationAdapter(projectId) {
    try {
      const dataLocation = await this.getPorjectDataInterestedLocationAdapter(projectId);
      const locations = dataLocation.data;
      var array0 = [];
      var array1 = [];

      locations.map(async (element, index) => {
        if(element.level1_meta_data === null) {
          element.level0_meta_data.map(async (item, itemIndex) => {
            const data = await NembusProjectService.getGeoJsonCoordinatesInterestedLocation(element.country, 0, item.levelId, item.featuresId);
            array0.push(data.data);
          });
        } else {
          const data = await NembusProjectService.getGeoJsonCoordinatesInterestedLocation(element.country, 1, element.level1_meta_data.levelId, element.level1_meta_data.featuresId);
          array1.push(data.data);
        }
      });

      return {
        level0: array0,
        level1: array1
      }
    } catch(error) {
      console.log(error);
    }
  }

  static async getPorjectDataInterestedLocationAdapter(projectId) {
    try {
      const data = await NembusProjectService.getPorjectDataInterestedLocation(projectId);
      return {
        data: data.data
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async addPorjectDataInterestedLocationAdapter(projectId, country, state) {
    try {
      const isProject = await NembusProjectAdapter.checkCurrentUserProjectAdapter(projectId);
      if(isProject === true) {
        const result = await NembusProjectService.addPorjectDataInterestedLocation(projectId, country, state);
        if(result === true) {
          NotificationManager.success("Interested location added");
          return true;
        } else {
          NotificationManager.error("Couldnot add interested location.");
          return false;
        }
      } else {
        return false;
      }
    } catch(error) {
      console.log(error);
    }
  }

  static async deleteProjectDataInterestedLocationAdapter(projectId, interestedLocationId) {
    try {
      const user = await NembusProjectService.getCurrentUser();
      const projectData = await NembusProjectService.getProjectData(projectId);

      if(user !== false && projectData !== false) {
        if(projectData.userId === user.uid) {
          const deleteResult = await NembusProjectService.deleteProjectDataInterestedLocation(projectId, interestedLocationId);
          if(deleteResult === false) {
            NotificationManager.error("Couldnot delete interested location.");
          } else {
            NotificationManager.success("Interested location deleted successfully.")
          }
        } else {
            NotificationManager.error("Invalid user. Only project owners can delete");
        }
      }
      return true;
    } catch(error) {
        NotificationManager.error("Couldnot delete interested location.");
        return false;
    }
  }

  static async getProjectDataTLEOrbitAdapter(projectId) {
    try {
      const data = await NembusProjectService.getProjectDataTLEOrbit(projectId);
      return {
        data: data.data
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async addProjectDataTLEOrbitAdapter(projectId, data) {
    try {
      const isProject = await NembusProjectAdapter.checkCurrentUserProjectAdapter(projectId);
      if(isProject === true) {
        var outcome = true;
        const dataFetch = await NembusProjectService.getProjectDataTLEOrbit(projectId);
        for(var i=0;i<data.length;i++) {
          var result = true;
          const filter = dataFetch.data.filter((current) => {
            return current.noradId === data[i].noradId;
          });
          
          if(filter.length > 0) {
            var requestData = data[i];
            delete requestData["Type / Application"];

            result = await NembusProjectService.updateProjectDataTLEOrbit(projectId, filter[0].docId, requestData);
          } else {
            result = await NembusProjectService.addProjectDataTLEOrbit(projectId, data[i]);
          }
          if(result === false){
            outcome = false;
          }
        }
        
        if(outcome === true) {
          NotificationManager.success("Satelite orbit added");
          return true;
        } else {
          NotificationManager.error("Couldnot add satelite orbit.");
          return false;
        }
      } else {
        return false;
      }      
    } catch(error) {
      console.log(error);
    }
  }

  static async deleteProjectDataTLEOrbitAdapter(projectId, TLEOrbitId) {
    try {
      const user = await NembusProjectService.getCurrentUser();
      const projectData = await NembusProjectService.getProjectData(projectId);

      if(user !== false && projectData !== false) {
        if(projectData.userId === user.uid) {
          const deleteResult = await NembusProjectService.deleteProjectDataTLEOrbit(projectId, TLEOrbitId);
          if(deleteResult === false) {
            NotificationManager.error("Couldnot delete saltelite orbit.");
          } else {
            NotificationManager.success("Satelite orbit deleted successfully.")
          }
        } else {
            NotificationManager.error("Invalid user. Only project owners can delete");
        }
      }
      return true;
    } catch(error) {
        NotificationManager.error("Couldnot delete satelite orbit.");
        return false;
    }
  }

  static async getAnalysisSheetInfoAdapter(projectId) {
    try {
      const data = await NembusProjectService.getAnalysisSheetInfo(projectId);
      return {
        data
      };
    } catch(error) {
      console.log(error);
    }
  }

  static async addAnalysisSheetTabsAdapter(projectId, sheetNo) {
    try {
      const isProject = await NembusProjectAdapter.checkCurrentUserProjectAdapter(projectId);
      if(isProject) {
        const result = await NembusProjectService.addAnalysisSheetTabs(projectId, sheetNo);
        if(result === true) {
          NotificationManager.success("Sheet Added");
          return true;
        } else {
          NotificationManager.error("Couldnot add sheet");
          return false;
        }
      } else {
        return false;
      }
    } catch(error) {
      console.log(error);
      return false;
    }
  }

  static async removeAnalysisSheetTabsAdapter(projectId, id) {
    try {
      const isProject = await NembusProjectAdapter.checkCurrentUserProjectAdapter(projectId);
      if(isProject) {
        const result = await NembusProjectService.removeAnalysisSheetTabs(projectId, id);
        if(result === false) {
          NotificationManager.error("Coudnot remove sheet.");
          return result;
        } else {
          NotificationManager.success("Sheet removed successfully.");
          return result;
        }
      } else {
        return false;
      }
    } catch(error) {
      console.log(error);
      return false;
    }
  }

  static async renameAnalysisSheetTabsAdapter(projectId, name, id) {
    try {
      const isProject = await NembusProjectAdapter.checkCurrentUserProjectAdapter(projectId);
      if(isProject) {
        const result = await NembusProjectService.renameAnalysisSheetTabs(projectId, name, id);
        if(result === false) {
          NotificationManager.error("Coudnot rename sheet.");
          return false;
        } else {
          NotificationManager.success("Sheet renamed successfully.");
          return true;
        }
      } else {
        return false;
      }
    } catch(error) {
      console.log(error);
      return false;
    }
  }
}